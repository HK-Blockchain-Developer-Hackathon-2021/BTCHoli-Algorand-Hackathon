from algosdk.v2client import algod

algod_address = "https://testnet-algorand.api.purestake.io/ps2"
algod_token = "RM93p0OJ6z3ClsPakUzfk2UxsEa4nfpl2aNKYTwD"

headers = {
    "X-API-Key": algod_token,
}

# Initialize an algod client
algod_client = algod.AlgodClient(algod_token=algod_token, algod_address=algod_address, headers=headers)
