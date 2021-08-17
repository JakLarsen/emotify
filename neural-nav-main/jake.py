import asyncio
import pathlib
import ssl
# import websockets
import json
from cortex import Cortex
from secrets import secrets
import threading
from live_advance import LiveAdvance
from sub_data import Subscribe


#WORKING THROUGH CORTEX

# User object to send to Live -> Cortex
jake_user = {
    'client_id': secrets['client_id'],
    'client_secret': secrets['client_secret'],
    "headset_id": secrets['headset_id'],
    "license": "", #don't generally need to specify license - cortext should find it based on client_id
    "debit": 100
}

#LiveAdvance instance
# jake = LiveAdvance()
# jake.do_prepare_steps()
# jake.load_profile("Jake Main")
# jake.live("Jake Main")
# jake.on_new_data()

#Subscribe Instance
jake = Subcribe()
jake.do_prepare_steps()
jake.sub(["mot"])
