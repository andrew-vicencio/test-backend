const   express     = require('express'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const user = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/organizations', (req, res) => {
    orgs.find({})
    .exec()
    .then(organizations => res.render('organizations', {organizations: organizations}))
    .catch(err => console.log(err));
});

app.get('/organizations/new', (req, res) => {
    res.render('new');
})

app.get('/api/organizations', (req, res) => {
    orgs
    .find(req.query ? req.query : {})
    .lean()
    .exec()
    .then(organizations => res.send(organizations))
    .catch(err => console.log(err));
});

app.post('/api/organizations', (req, res) => {
    orgs
    .create(req.body.organization)
    .then((organization, err) => {
        if (err) {
            console.log('error');
            res.sendStatus(403);
        } else {
            res.redirect('/organizations');
            
        }
    });
});

app.post('/api/register', (req, res) => {
    user
    .create(req.body.user)
    .then((user, err) => {
        if (err) {
            console.log(err);
            res.sendStatus(403);
        } else {
            res.sendStatus(200);
        }
    });
});

app.post('/api/login', (req, res) => {
    user
    .find(req.body.user)
    .then((user, err) => {
        if (err) {
            console.log(err);
            res.sendStatus(403);
        } else {
            console.log(req.body);
            res.send(user);
        }
    });
});

app.listen(process.env.PORT || 3000, () => console.log(`Server listening on port ${process.env.PORT || 3000}`));