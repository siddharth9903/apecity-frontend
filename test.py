# import websocket

# def on_message(ws, message):
#     print("Received:", message)

# def on_error(ws, error):
#     print("Error:", error)

# def on_close(ws, close_status_code, close_msg):
#     print("Connection closed:", close_status_code, close_msg)

# def on_open(ws):
#     print("Connection opened")
#     ws.send("Hello, Server")

# headers = {
#     'Authorization': 'secretToken'
# }
# # ws = websocket.WebSocketApp("wss://2bhu85569j.execute-api.us-east-1.amazonaws.com/subgraphs/name/APE",
# # ws = websocket.WebSocketApp("ws://184.72.85.174:8001/subgraphs/name/APE",
# ws = websocket.WebSocketApp('ws://ws.apecity.fun/subgraphs/name/APE',
#                             subprotocols=["graphql-ws"],
#                             # header=headers,
#                             on_open=on_open,
#                             on_message=on_message,
#                             on_error=on_error,
#                             on_close=on_close)

# ws.run_forever()

import websocket

def on_message(ws, message):
    print("Received:", message)

def on_error(ws, error):
    print("Error:", error)

def on_close(ws, close_status_code, close_msg):
    print("Connection closed:", close_status_code, close_msg)

def on_open(ws):
    print("Connection opened")
    # Send a GraphQL subscription query or a simple message to test
    # ws.send('{"type":"/subgraphs/name/APE","payload":{}}')  # Initialize the connection
    # ws.send('{"id":"1","type":"start","payload":{"query":"subscription { somethingChanged { id } }"}}')

headers = {
    # 'Authorization': 'secretToken'
}
# ws = websocket.WebSocketApp("ws://ws.apecity.fun/subgraphs/name/APE",
# ws = websocket.WebSocketApp("wss://n5t40nbwk1.execute-api.us-east-1.amazonaws.com/production",
# ws = websocket.WebSocketApp("wss://ws.apecity.fun/subgraphs/name/APE",
# ws = websocket.WebSocketApp("ws://184.72.85.174/subgraphs/name/APE",
ws = websocket.WebSocketApp("ws://ecs-api-graph-tenderly-lb-1919492898.us-east-1.elb.amazonaws.com/subgraphs/name/APE",
                            subprotocols=["graphql-ws"],
                            header=headers,
                            on_open=on_open,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close
                            )

ws.run_forever()
