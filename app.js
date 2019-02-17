const   express     = require('express'),
        mongoose    = require('mongoose');

const app = express();

mongoose
.connect("mongodb://example:exampleuser123@ds337985.mlab.com:37985/charing", { useNewUrlParser: true })
.catch(err => console.log(err));

mongoose.set('useFindAndModify', false);

const organizationSchema = new mongoose.Schema({
    name: String,
    location: String,
    tag: [String]
});

const orgs = mongoose.model("Organization", organizationSchema);

app.get('/', (req, res) => {
    res.send("It's working!");
});

app.get('/organizations', (req, res) => {
    orgs
    .find({})
    .lean()
    .exec()
    .then(orgs => res.send(orgs))
    .catch(err => console.log(err));
});

app.listen(3000, () => console.log('Server listening on port 3000'));