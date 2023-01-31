require('dotenv').config()
const express = require('express');
const bodyparser = require('body-parser');
// const getdate = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');
const path=require('path');


mongoose.connect(process.env.mongodb_uri, { useNewUrlParser: true });


const app = express();
const port =3000;

app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static('./public'));


const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
    name: 'Item 1'
})

const item2 = new Item({
    name: 'Item 2'
})

const item3 = new Item({
    name: 'Item 3'
})

const defaultitems = [item1, item2, item3];


const listSchema = new mongoose.Schema({
    name: String,
    item: [itemSchema]
})

const LIST = mongoose.model("LIST", listSchema);









app.get("/", (req, res) => {
    // let date = getdate.getDate();

    Item.find({}, (err, foundItems) => {
        if (foundItems.length == 0) {
            Item.insertMany(defaultitems, (err) => {
                if (err) {
                    console.log('There is an error!!');
                }

            })
            res.redirect('/');
        }
        else {
            res.render('lists', { listtitle: 'TODAY', listitem: foundItems });
        }




    })




})
app.post('/', (req, res) => {

    const itemName = req.body.addanother;
    const listname = req.body.list;

    const item = new Item({
        name: itemName
    })


    if (listname == 'TODAY') {
        item.save();
        res.redirect('/')
    }
    else {
        LIST.findOne({ name: listname }, (err, foundList) => {
            foundList.item.push(item);
            foundList.save();
            res.redirect('/' + listname)
        })


    }

});

app.post('/delete', (req, res) => {
    const checkeditemid = req.body.checkbox;
    const listname = req.body.hiddenlistname;

    if (listname == 'TODAY') {
        Item.findByIdAndRemove(checkeditemid, (err) => {
            if (!err) {
                res.redirect('/');
            }


        })

    }
    else {
        LIST.findOneAndUpdate({ name: listname }, { $pull: { item: { _id: checkeditemid } } }, (err, deleteitem) => {
            {
                if (!err) {
                    res.redirect('/' + listname);
                }
            }
        })
    }






})

app.get('/:sitename', (req, res) => {
    const sitename = _.capitalize(req.params.sitename);
    LIST.findOne({ name: sitename }, (err, foundlist) => {
        if (!err) {
            if (!foundlist) {
                const List = new LIST({
                    name: sitename,
                    item: defaultitems

                });
                List.save();
                res.redirect('/' + sitename);

            }
            else {
                res.render('lists', { listtitle: foundlist.name, listitem: foundlist.item })
            }
        }

    })
})

app.listen(port, () => {
    console.log(`This app  is running on port ${port}`);
})
















