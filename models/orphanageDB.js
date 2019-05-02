var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var children_model = mongoose.model('childrenModel',new Schema({name: String, age: Number, gender: String, about: String, org: String, org_link: String, img_path: String}), 'Children');
var org_model = mongoose.model('orgModel',new Schema({name: String, about: String, org_link: String, donation_link: String, img_path: String, address: String}), 'Organizations');

module.exports.getAllChildren = function () {
    try {
	return children_model.find();
    } catch(err) {
	console.log(err);
    }
}
module.exports.getAllOrgs = function () {
    try {
	return org_model.find();
    } catch(err) {
	console.log(err);
    }
}
