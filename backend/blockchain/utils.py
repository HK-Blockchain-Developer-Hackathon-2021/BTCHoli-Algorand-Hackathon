import json
import hashlib

def process_payload(payload):
    asset_metadata = {
            'coupon_rate': payload['coupon_rate'],
            'issuer_name': payload['issuer_name'],
            'face_value': payload['face_value'],
            'issue_date': payload['issue_date'],
            'maturity_date': payload['maturity_date'],
            'number_of_annual_payments': payload['number_of_annual_payments'],
            'nature_of_bond': payload['nature_of_bond'],
    }
    asset_details = {
        'bond_name': payload['bond_name'][:3],
        'issue_size': payload['issue_size'],
        'metadata_hash': hashlib.md5(json.dumps(asset_metadata).encode()).hexdigest()
    }
    return asset_details

def wait_for_confirmation(client, txid):
    """
    Utility function to wait until the transaction is
    confirmed before proceeding.
    """
    last_round = client.status().get('last-round')
    txinfo = client.pending_transaction_info(txid)
    while not (txinfo.get('confirmed-round') and txinfo.get('confirmed-round') > 0):
        print("Waiting for confirmation")
        last_round += 1
        client.status_after_block(last_round)
        txinfo = client.pending_transaction_info(txid)
    print("Transaction {} confirmed in round {}.".format(txid, txinfo.get('confirmed-round')))
    return txinfo


#   Utility function used to print created asset for account and assetid
def print_created_asset(algodclient, account, assetid):
    # note: if you have an indexer instance available it is easier to just use this
    # response = myindexer.accounts(asset_id = assetid)
    # then use 'account_info['created-assets'][0] to get info on the created asset
    account_info = algodclient.account_info(account)
    idx = 0;
    for my_account_info in account_info['created-assets']:
        scrutinized_asset = account_info['created-assets'][idx]
        idx = idx + 1
        if (scrutinized_asset['index'] == assetid):
            print("Asset ID: {}".format(scrutinized_asset['index']))
            print(json.dumps(my_account_info['params'], indent=4))
            break


#   Utility function used to print asset holding for account and assetid
def print_asset_holding(algodclient, account, assetid):
    # note: if you have an indexer instance available it is easier to just use this
    # response = myindexer.accounts(asset_id = assetid)
    # then loop thru the accounts returned and match the account you are looking for
    account_info = algodclient.account_info(account)
    idx = 0
    for my_account_info in account_info['assets']:
        scrutinized_asset = account_info['assets'][idx]
        idx = idx + 1
        if (scrutinized_asset['asset-id'] == assetid):
            print("Asset ID: {}".format(scrutinized_asset['asset-id']))
            print(json.dumps(scrutinized_asset, indent=4))
            break

def get_number_of_seconds(unit, frequency):
    if frequency == "seconds":
        return 1
    elif frequency == "minutes":
        return int(60/unit)
    elif frequency == "hourly":
        return int(60*60/unit)
    elif frequency == "daily":
        return int(60*60*24/unit)
    elif frequency == "monthly":
        return int(60*60*24*30/unit)
    elif frequency == "annually":
        return int(60*60*24*30*12/unit)

