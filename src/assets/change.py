import json
import random

f = open("images.json", "r+")
w = open("wordToIDMapping.json", "r+")
c = open("csvToJsonData.json", "r+")
i = open("firebase.json", "r+")


wordToIDMapping = json.load(w)
images = json.load(i)
csvToJsonData = json.load(c)
count = 0
structured_data = {}
word_info = {}
words = list(images.keys())

# while (count < 100):
#     index = random.randint(0, len(words))
#     word = words[index]
#     word_info = {}
#     word_info['wordID'] = images[word]['wordID']
#     # word_info['wordDetails'] = csvToJsonData[str(wordToIDMapping[word])][1:4]
#     word_info['images'] = images[word]['images']
#     word_info['checked'] = 0
#     structured_data[word] = word_info
#     words.pop(index)
#     count += 1


# i.seek(0)
# json.dump(structured_data, i, indent=4)
# i.truncate()
print(len(list(images.keys())))
