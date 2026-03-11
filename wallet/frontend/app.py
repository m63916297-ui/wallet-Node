import streamlit as st
import requests
import json
import os
from datetime import datetime

API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:3000/api")

st.set_page_config(page_title="Swiss Crypto Ramp", page_icon="🏦", layout="wide")

if "token" not in st.session_state:
    st.session_state.token = None
if "user" not in st.session_state:
    st.session_state.user = None


def api_request(endpoint, method="GET", data=None, use_token=True):
    headers = {"Content-Type": "application/json"}
    if use_token and st.session_state.token:
        headers["Authorization"] = f"Bearer {st.session_state.token}"

    url = f"{API_BASE_URL}{endpoint}"
    response = None

    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        return response
    except requests.exceptions.ConnectionError:
        st.error("Cannot connect to API. Make sure the backend is running.")
        return None


def login_page():
    st.title("🏦 Swiss Crypto Ramp")
    st.markdown("### Secure Cryptocurrency On/Off Ramp - Switzerland")

    col1, col2 = st.columns([1, 1])

    with col1:
        st.markdown("#### Login")
        email = st.text_input("Email", key="login_email")
        password = st.text_input("Password", type="password", key="login_password")

        if st.button("Login"):
            response = api_request(
                "/auth/login",
                "POST",
                {"email": email, "password": password},
                use_token=False,
            )

            if response and response.status_code == 200:
                data = response.json()
                st.session_state.token = data["token"]
                st.session_state.user = data["user"]
                st.rerun()
            elif response:
                st.error(response.json().get("message", "Login failed"))

    with col2:
        st.markdown("#### Register")
        with st.form("register_form"):
            first_name = st.text_input("First Name")
            last_name = st.text_input("Last Name")
            reg_email = st.text_input("Email")
            reg_password = st.text_input("Password", type="password")
            phone = st.text_input("Phone Number (optional)")
            swiss_resident = st.checkbox("Swiss Resident")

            submitted = st.form_submit_button("Register")

            if submitted:
                response = api_request(
                    "/auth/register",
                    "POST",
                    {
                        "email": reg_email,
                        "password": reg_password,
                        "firstName": first_name,
                        "lastName": last_name,
                        "phoneNumber": phone,
                        "swissResident": swiss_resident,
                    },
                    use_token=False,
                )

                if response and response.status_code == 201:
                    data = response.json()
                    st.session_state.token = data["token"]
                    st.session_state.user = data["user"]
                    st.success("Account created successfully!")
                    st.rerun()
                elif response:
                    st.error(response.json().get("message", "Registration failed"))


def dashboard():
    st.title("🏦 Swiss Crypto Ramp Dashboard")

    st.sidebar.title(f"Welcome, {st.session_state.user['firstName']}")
    st.sidebar.markdown(
        f"**Status:** {st.session_state.user.get('kycStatus', 'PENDING')}"
    )
    if st.sidebar.button("Logout"):
        st.session_state.token = None
        st.session_state.user = None
        st.rerun()

    tab1, tab2, tab3, tab4, tab5 = st.tabs(
        ["💱 Ramp On", "💰 Ramp Off", "📊 Transactions", "📈 Rates", "⚙️ Settings"]
    )

    with tab1:
        st.markdown("### Buy Crypto with CHF")
        with st.form("ramp_on_form"):
            col1, col2 = st.columns(2)
            with col1:
                amount = st.number_input("Amount (CHF)", min_value=100.0, step=50.0)
                crypto = st.selectbox("Cryptocurrency", ["BTC", "ETH", "USDT"])
            with col2:
                payment_method = st.selectbox(
                    "Payment Method", ["BANK_TRANSFER", "CREDIT_CARD"]
                )
                wallet_address = st.text_input("Wallet Address")

            submitted = st.form_submit_button("Buy Crypto")

            if submitted:
                response = api_request(
                    "/transactions/ramp-on",
                    "POST",
                    {
                        "amount": amount,
                        "cryptoCurrency": crypto,
                        "paymentMethod": payment_method,
                        "walletAddress": wallet_address,
                    },
                )

                if response and response.status_code == 201:
                    data = response.json()
                    st.success(
                        f"Transaction created! Amount: {data['transaction']['amount']} {crypto}"
                    )
                elif response:
                    st.error(response.json().get("message", "Transaction failed"))

    with tab2:
        st.markdown("### Sell Crypto for CHF")
        with st.form("ramp_off_form"):
            col1, col2 = st.columns(2)
            with col1:
                crypto_amount = st.number_input(
                    "Crypto Amount", min_value=0.001, step=0.01
                )
                crypto_currency = st.selectbox("Cryptocurrency", ["BTC", "ETH", "USDT"])
            with col2:
                wallet_addr = st.text_input("Your Wallet Address")
                st.markdown("#### Bank Details")
                bank_name = st.text_input("Bank Name")
                iban = st.text_input("IBAN")

            submit_off = st.form_submit_button("Sell Crypto")

            if submit_off:
                response = api_request(
                    "/transactions/ramp-off",
                    "POST",
                    {
                        "amount": crypto_amount,
                        "cryptoCurrency": crypto_currency,
                        "walletAddress": wallet_addr,
                        "bankDetails": {"bankName": bank_name, "iban": iban},
                    },
                )

                if response and response.status_code == 201:
                    data = response.json()
                    st.success(
                        f"Transaction created! You will receive: CHF {data['transaction']['amountFiat']}"
                    )
                elif response:
                    st.error(response.json().get("message", "Transaction failed"))

    with tab3:
        st.markdown("### Transaction History")

        response = api_request("/transactions")

        if response and response.status_code == 200:
            data = response.json()
            transactions = data.get("transactions", [])

            if transactions:
                for tx in transactions:
                    with st.expander(
                        f"{tx['type']} - {tx['cryptoCurrency']} - {tx['status']}"
                    ):
                        st.markdown(f"""
                        - **Amount:** {tx["amount"]} {tx["cryptoCurrency"]}
                        - **Fiat Amount:** {tx["amountFiat"]} {tx["fiatCurrency"]}
                        - **Exchange Rate:** {tx["exchangeRate"]}
                        - **Status:** {tx["status"]}
                        - **Date:** {datetime.fromisoformat(str(tx["createdAt"])).strftime("%Y-%m-%d %H:%M")}
                        """)
            else:
                st.info("No transactions yet")
        elif response:
            st.error("Failed to load transactions")

    with tab4:
        st.markdown("### Live Exchange Rates")

        response = api_request("/transactions/rates?currencies=bitcoin,ethereum,tether")

        if response and response.status_code == 200:
            rates = response.json()

            col1, col2, col3 = st.columns(3)

            with col1:
                st.metric(
                    "Bitcoin (BTC)",
                    f"CHF {rates.get('bitcoin', {}).get('chf', 'N/A')}",
                    f"USD {rates.get('bitcoin', {}).get('usd', 'N/A')}",
                )
            with col2:
                st.metric(
                    "Ethereum (ETH)",
                    f"CHF {rates.get('ethereum', {}).get('chf', 'N/A')}",
                    f"USD {rates.get('ethereum', {}).get('usd', 'N/A')}",
                )
            with col3:
                st.metric(
                    "Tether (USDT)",
                    f"CHF {rates.get('tether', {}).get('chf', 'N/A')}",
                    f"USD {rates.get('tether', {}).get('usd', 'N/A')}",
                )
        elif response:
            st.error("Failed to load rates")

    with tab5:
        st.markdown("### ⚙️ Platform Settings")

        response = api_request("/settings")

        if response and response.status_code == 200:
            data = response.json()
            settings = data.get("settings", {})

            for category, items in settings.items():
                with st.expander(f"📁 {category}"):
                    for item in items:
                        col1, col2, col3 = st.columns([2, 2, 1])
                        with col1:
                            st.markdown(f"**{item['key']}**")
                            if item.get("description"):
                                st.caption(item["description"])
                        with col2:
                            if item["dataType"] == "BOOLEAN":
                                new_value = st.checkbox(
                                    "Value",
                                    value=bool(item["value"]),
                                    key=f"setting_{item['key']}",
                                )
                            elif item["dataType"] == "NUMBER":
                                new_value = st.number_input(
                                    "Value",
                                    value=float(item["value"]),
                                    key=f"setting_{item['key']}",
                                )
                            elif item["dataType"] == "JSON":
                                new_value = st.text_area(
                                    "Value (JSON)",
                                    value=json.dumps(item["value"]),
                                    key=f"setting_{item['key']}",
                                )
                            else:
                                new_value = st.text_input(
                                    "Value",
                                    value=str(item["value"]),
                                    key=f"setting_{item['key']}",
                                )
                        with col3:
                            if item.get("isEditable", False):
                                if st.button("💾", key=f"save_{item['key']}"):
                                    try:
                                        if item["dataType"] == "JSON":
                                            new_value = json.loads(new_value)
                                    except:
                                        pass

                                    update_response = api_request(
                                        f"/settings/{item['key']}",
                                        "PUT",
                                        {"value": new_value},
                                    )
                                    if (
                                        update_response
                                        and update_response.status_code == 200
                                    ):
                                        st.success("Saved!")
                                        st.rerun()
                                    else:
                                        st.error("Error saving")
                            else:
                                st.caption("🔒 Locked")

                        st.divider()

            with st.expander("➕ Add New Setting"):
                with st.form("new_setting_form"):
                    new_key = st.text_input("Key").upper()
                    new_value = st.text_input("Value")
                    new_category = st.selectbox(
                        "Category",
                        [
                            "GENERAL",
                            "CRYPTO",
                            "PAYMENT",
                            "FEES",
                            "LIMITS",
                            "API",
                            "SECURITY",
                        ],
                    )
                    new_desc = st.text_input("Description")
                    new_type = st.selectbox(
                        "Data Type", ["STRING", "NUMBER", "BOOLEAN", "JSON"]
                    )
                    is_public = st.checkbox("Public", value=True)

                    if st.form_submit_button("Create Setting"):
                        try:
                            value = new_value
                            if new_type == "NUMBER":
                                value = float(new_value)
                            elif new_type == "BOOLEAN":
                                value = new_value.lower() == "true"
                            elif new_type == "JSON":
                                value = json.loads(new_value)
                        except:
                            st.error("Invalid value format")
                            value = new_value

                        create_response = api_request(
                            "/settings",
                            "POST",
                            {
                                "key": new_key,
                                "value": value,
                                "category": new_category,
                                "description": new_desc,
                                "dataType": new_type,
                                "isPublic": is_public,
                            },
                        )
                        if create_response and create_response.status_code == 201:
                            st.success("Setting created!")
                            st.rerun()
                        elif create_response:
                            st.error(
                                create_response.json().get(
                                    "message", "Error creating setting"
                                )
                            )
        elif response:
            st.error("Failed to load settings")

        st.markdown("---")
        st.markdown("#### 🌐 Public Settings (for users)")

        public_response = api_request("/settings/public")
        if public_response and public_response.status_code == 200:
            public_settings = public_response.json()
            st.json(public_settings)
        elif public_response:
            st.error("Failed to load public settings")


def main():
    if not st.session_state.token:
        login_page()
    else:
        dashboard()


if __name__ == "__main__":
    main()
