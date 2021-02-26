import json
from algosdk import mnemonic
from algosdk.future.transaction import AssetConfigTxn, AssetTransferTxn, AssetFreezeTxn
from blockchain.connect_network import algod_client
from blockchain.utils import print_asset_holding, print_created_asset, wait_for_confirmation, process_payload
from blockchain.test import bond_info

mnemonic1 = "other chief ill volcano wonder exercise neglect energy sell general spot kiwi what kiss lunar wrestle column prefer heavy gate quiz rubber oblige ability video"
mnemonic2 = "hidden company cheap toe ready fish shock spread cost satisfy solution loud cereal tongue pig degree ice what ensure fan ill level wheat ability wait"
mnemonic3 = "valve affair shoulder all exhaust evil small model tornado inspire crane army horse dismiss ridge book quiz tribe sport hero wild slab grape absent rebuild"

# For ease of reference, add account public and private keys to
# an accounts dict.
accounts = {}
counter = 1
for m in [mnemonic1, mnemonic2, mnemonic3]:
    accounts[counter] = {}
    accounts[counter]['pk'] = mnemonic.to_public_key(m)
    accounts[counter]['sk'] = mnemonic.to_private_key(m)
    counter += 1

print("Account 1 address: {}".format(accounts[1]['pk']))
print("Account 2 address: {}".format(accounts[2]['pk']))
print("Account 3 address: {}".format(accounts[3]['pk']))

# CREATE ASSET
def create_asset(payload):
    asset_details = process_payload(payload)
    # Get network params for transactions before every transaction.
    params = algod_client.suggested_params()
    params.fee = 10
    params.flat_fee = True

    # Account 1 creates an asset called latinum and
    # sets Account 2 as the manager, reserve, freeze, and clawback address.
    # Asset Creation transaction

    txn = AssetConfigTxn(
        sender=accounts[1]['pk'],
        sp=params,
        total=asset_details['issue_size'],
        default_frozen=False,
        unit_name=asset_details['bond_name'].upper(),
        asset_name=asset_details['bond_name'],
        manager=accounts[1]['pk'],
        reserve=accounts[1]['pk'],
        freeze=accounts[1]['pk'],
        clawback=accounts[1]['pk'],
        # url="https://path/to/my/asset/details",
        decimals=0,
        metadata_hash=asset_details['metadata_hash'].encode('ascii'))
    # Sign with secret key of creator
    stxn = txn.sign(accounts[1]['sk'])

    # Send the transaction to the network and retrieve the txid.
    txid = algod_client.send_transaction(stxn)
    print(txid)

    # Retrieve the asset ID of the newly created asset by first
    # ensuring that the creation transaction was confirmed,
    # then grabbing the asset id from the transaction.

    # Wait for the transaction to be confirmed
    wait_for_confirmation(algod_client, txid)

    try:
        # Pull account info for the creator
        # account_info = algod_client.account_info(accounts[1]['pk'])
        # get asset_id from tx
        # Get the new asset's information from the creator account
        ptx = algod_client.pending_transaction_info(txid)
        asset_id = ptx["asset-index"]
        print_created_asset(algod_client, accounts[1]['pk'], asset_id)
        print_asset_holding(algod_client, accounts[1]['pk'], asset_id)
    except Exception as e:
        print(e)

create_asset(bond_info)

# OPT-IN
def activate_account(asset_id):
    # Check if asset_id is in account 3's asset holdings prior
    # to opt-in
    params = algod_client.suggested_params()
    # comment these two lines if you want to use suggested params
    params.fee = 0
    params.flat_fee = False
    params.min_fee = 0

    account_info = algod_client.account_info(accounts[3]['pk'])
    holding = None
    idx = 0
    for my_account_info in account_info['assets']:
        scrutinized_asset = account_info['assets'][idx]
        idx = idx + 1
        if (scrutinized_asset['asset-id'] == asset_id):
            holding = True
            break

    if not holding:
        # Use the AssetTransferTxn class to transfer assets and opt-in
        txn = AssetTransferTxn(
            sender=accounts[3]['pk'],
            sp=params,
            receiver=accounts[3]["pk"],
            amt=0,
            index=asset_id)
        stxn = txn.sign(accounts[3]['sk'])
        txid = algod_client.send_transaction(stxn)
        print(txid)
        # Wait for the transaction to be confirmed
        wait_for_confirmation(algod_client, txid)
        # Now check the asset holding for that account.
        # This should now show a holding with a balance of 0.
        print_asset_holding(algod_client, accounts[3]['pk'], asset_id)

# TRANSFER ASSET
def transfer_asset(asset_id):
    # transfer asset of 10 from account 1 to account 3
    params = algod_client.suggested_params()
    # comment these two lines if you want to use suggested params
    params.fee = 1
    params.flat_fee = True
    txn = AssetTransferTxn(
        sender=accounts[1]['pk'],
        sp=params,
        receiver=accounts[3]["pk"],
        amt=1,
        index=asset_id)
    stxn = txn.sign(accounts[1]['sk'])
    txid = algod_client.send_transaction(stxn)
    print(txid)
    # Wait for the transaction to be confirmed
    wait_for_confirmation(algod_client, txid)
    # The balance should now be 10.
    print_asset_holding(algod_client, accounts[3]['pk'], asset_id)

# # DESTROY ASSET
# # With all assets back in the creator's account,
# # the manager (Account 1) destroys the asset.
# params = algod_client.suggested_params()
# # comment these two lines if you want to use suggested params
# params.fee = 1000
# params.flat_fee = True
#
# # Asset destroy transaction
# txn = AssetConfigTxn(
#     sender=accounts[1]['pk'],
#     sp=params,
#     index=asset_id,
#     strict_empty_address_check=False
# )
#
# # Sign with secret key of creator
# stxn = txn.sign(accounts[1]['sk'])
# # Send the transaction to the network and retrieve the txid.
# txid = algod_client.send_transaction(stxn)
# print(txid)
# # Wait for the transaction to be confirmed
# wait_for_confirmation(algod_client, txid)
#
# # Asset was deleted.
# try:
#     print("Account 3 must do a transaction for an amount of 0, " )
#     print("with a close_assets_to to the creator account, to clear it from its accountholdings")
#     print("For Account 1, nothing should print after this as the asset is destroyed on the creator account")
#
#     print_asset_holding(algod_client, accounts[1]['pk'], asset_id)
#     print_created_asset(algod_client, accounts[1]['pk'], asset_id)
#     # asset_info = algod_client.asset_info(asset_id)
# except Exception as e:
#     print(e)

# Transaction C7BOB7ZNVIJ477LEAIJYDNXIIFZTY7ETTB3QEV3GWRJ7BGOZMSGA confirmed in round 3983117.
# Account 3 must do a transaction for an amount of 0,
# with a close_assets_to to the creator account, to clear it from its accountholdings
# For Account 1, nothing should print after this if the asset is destroyed on the creator account
