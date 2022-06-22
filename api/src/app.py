import os
import sys

from flask import Flask, jsonify, make_response, request
import covalent_api

app = Flask(__name__)

covalent_session = covalent_api.Session(server_url="https://api.covalenthq.com", api_key=os.environ.get("COVALENT_API_KEY"))
cov_class_a = covalent_api.ClassA(covalent_session)


def _get_params():
    chain_id = request.args.get("chain_id")
    addr = request.args.get("contract_addr")

    return chain_id, addr


def _check_params(chain_id, addr):
    if not (chain_id and addr):
        return make_response(("missing required parameters (chain_id, contract_addr)", 400))


@app.route("/balance/current", methods=["GET"])
def get_contract_balance():
    chain_id, contract_addr = _get_params()
    rsp = _check_params(chain_id, contract_addr)

    if not rsp:
        balances = cov_class_a.get_token_balances_for_address(chain_id, contract_addr)

        if balances["error"]:
            rsp = make_response(("covalent returned an error", 500))
        else:
            rsp_data = []
            # TODO: handle pagination
            for balance in balances["data"]["items"]:
                rsp_data.append(
                    {
                        "name": balance["contract_name"],
                        "ticker": balance["contract_ticker_symbol"],
                        "decimals": balance["contract_decimals"],
                        "balance": balance["balance"],
                        "address": balance["contract_address"],
                    }
                )

            rsp = jsonify(rsp_data)

    rsp.headers.add("Access-Control-Allow-Origin", "*")
    return rsp


@app.route("/balance/historical", methods=["GET"])
def get_contract_historical_portfolio():
    chain_id, contract_addr = _get_params()
    rsp = _check_params(chain_id, contract_addr)

    if not rsp:
        data = cov_class_a.get_historical_portfolio_value_over_time(chain_id, contract_addr)

        if data["error"]:
            rsp = make_response(("covalent returned an error", 500))
        else:
            historical_data = []
            # TODO: handle pagination
            for token in data["data"]["items"]:
                historical = []
                total_balance = 0

                for item in token["holdings"]:
                    total_balance += int(item["open"]["balance"])
                    historical.insert(
                        0,
                        {
                            "timestamp": item["timestamp"],
                            "balance": item["open"]["balance"],
                        },
                    )

                if total_balance > 0:
                    historical_data.append(
                        {
                            "address": token["contract_address"],
                            "name": token["contract_name"],
                            "ticker": token["contract_ticker_symbol"],
                            "decimals": token["contract_decimals"],
                            "historical": historical,
                        }
                    )

            rsp = jsonify(historical_data)

    rsp.headers.add("Access-Control-Allow-Origin", "*")
    return rsp


@app.route("/")
def hello():
    return "hello world!"
