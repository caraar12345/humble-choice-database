import requests
from bs4 import BeautifulSoup
from jsonpath_ng import jsonpath, parse
import json

humble_base_url = 'https://www.humblebundle.com/subscription/'
months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
years = ['2019', '2020', '2021']

## JSONPath expressions
game_expressions = {
  'game': '$.contentChoiceOptions.contentChoiceData.*.content_choices.*',
  'title': '$.title',
  'description': '$.description',
  'image': '$.image',
  'user_rating': '$.user_rating."steam_percent|decimal"',
  'platforms': '$.platforms',
  'msrp': '$."msrp|money".amount',
  'developers': '$.developers',
  'genres': '$.genres'
}
extras_expressions = {
  'extras': '$.contentChoiceOptions.contentChoiceData.extras[*]',
  'title': '$.human_name',
  'image': '$.icon_path',
  'types': '$.types'
}

## Generates dictionary of game details
def generate_game_details(game,excluded_details,humble_type):
  game_details = {
    'humble_type': humble_type
  }
  for key, value in game_expressions.items():
    if key not in excluded_details:
      game_details[key] = parse(value).find(game.value)[0].value
  return game_details

## Generates dictionary of extras details
def generate_extras_details(extras,humble_type):
  extras_details = {
    'humble_type': humble_type
  }
  for key, value in extras_expressions.items():
    if key != 'extras':
      extras_details[key] = parse(value).find(extras.value)[0].value
  return extras_details

all_games = {}

for y in years:
    for x in months:
      ## Skips all months but December in 2019
      if x != 'december' and y == '2019':
        continue
      ## Skips November in 2021 as the page exists but no content is there
      elif x == 'november' and y == '2021':
        continue
      else:
        ## Generates the URL for the month: https://www.humblebundle.com/subscription/january-2020 etc.
        choice_id = x+'-'+y
        print(choice_id)
        url = humble_base_url + x + '-' + y
        ## Gets the page
        r = requests.get(url)
        if r.status_code != 200:
          ## If the page doesn't exist, skip it
          print('Error: ' + str(r.status_code))
          continue
        ## Parses the page
        soup = BeautifulSoup(r.text, 'html.parser')
        ## Gets the JSON data
        choices = soup.findAll("script", id="webpack-monthly-product-data", text=True)[0].text
        ## Converts the JSON data to a dictionary
        json_choices = json.loads(choices)
        ## Gets the list of games from the JSON data
        games = parse(game_expressions['game']).find(json_choices)
        ## Gets the list of extras from the JSON data
        extras = parse(extras_expressions['extras']).find(json_choices)
        ## Sets up this month's dictionary in all_games
        all_games[choice_id] = {'url': url}
        ## Sets up the games and extras lists
        this_months_games = []
        this_months_extras = []
        ## Loops through each game
        for game in games:
          ## Generates the humble_type ('extras' / 'initial' / 'initial-get-all-games')
          humble_type = str(game.full_path).split('.')[-3]
          ## Tries to generate the game details
          try:
            game_details = generate_game_details(game, excluded_details=['game'], humble_type=humble_type)
          ## Some games don't have a user rating, so we regenerate the game details without the user rating
          except Exception:
            game_details = generate_game_details(game, excluded_details=['game','user_rating'], humble_type=humble_type)
          this_months_games.append(game_details)
        ## Sets the games list in the month's dictionary
        all_games[choice_id]['games'] = this_months_games

        ## Loops through each extra
        for extra in extras:
          ## Runs the generate_extras_details function
          extras_details = generate_extras_details(extra, humble_type='extras')
          ## Adds the extras details to the extras list
          this_months_extras.append(extras_details)
        ## Sets the extras list in the month's dictionary
        all_games[choice_id]['extras'] = this_months_extras

## Writes the dictionary to a JSON file
with open("export.json", "w") as export_file:
  export_file.write(json.dumps(all_games))