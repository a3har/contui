import firebase_admin
import json
from firebase_admin import credentials
from firebase_admin import firestore
import progressbar

f = open("giphy_syn.json", "r+")
a = open("images.json", "r+")

all_images = json.load(a)
giphy_syn = json.load(f)

# Firebase Authentication
cred = credentials.Certificate("firebase-sdk-admin.json")
firebase_admin.initialize_app(cred)


db = firestore.client()
collection_ref = db.collection('allImgsNew')

count = 0
widgets = [' [',
           progressbar.Timer(format='elapsed time: %(elapsed)s'),
           '] ',
           progressbar.Bar('*'), ' (',
           progressbar.ETA(), ') ',
           ]

bar = progressbar.ProgressBar(max_value=len(giphy_syn.keys()),
                              widgets=widgets).start()


keys = list(giphy_syn.keys())
for key in keys:
    changed = False
    try:
        document = collection_ref.document(key)
        wordData = document.get().to_dict()
        wordData['checked'] = 0
        for src in giphy_syn[key]:
            image_exists = False
            try:
                # Checking if image url already exists in firestore
                for wordDataImage in wordData['images']:
                    if wordDataImage['src'] == src:
                        image_exists = True
                if not image_exists:
                    image = {"count": 0, "src": src}
                    wordData['images'].append(image)
                    changed = True
            except:
                pass

        if changed:
            print("\n\n"+key + " changed")
            document.set(wordData)

        # Updating the progress bar
        count += 1
        bar.update(count)

    except:
        print("\n\n"+key + " not found in Firestore")


a.close()
f.close()
