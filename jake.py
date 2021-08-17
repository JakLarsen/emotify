from cortex import Cortex
from user_info import secrets
from live_advance import LiveAdvance
from sub_data import Subscribe


#WORKING THROUGH CORTEX

# name of training profile
def open_stream():
    profile_name = 'Jake Main'

    # Init live advance
    jake = LiveAdvance()

    # do prepare steps
    jake.do_prepare_steps()

    # load existed profile
    jake.load_profile(profile_name)

    # get active actions
    jake.get_active_action(profile_name)

    # get sensitivity values of actions
    jake.get_sensitivity(profile_name)

    # set sensitivity for active actions
    values = [7,7,5,5]
    jake.set_sensitivity(profile_name, values)

    # live mental command data
    jake.live(profile_name)

# open_stream()

# -----------------------------------------------------------

# open websocket from browser to flask server -> relay datastream from emotiv sdk to the browser
# get data showing on client
# then use input to move slideshow side to side
