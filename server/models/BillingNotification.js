var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var BillingNotificationSchema = Schema(
    {
        message: { type: Schema.Types.Mixed }
    }
);

//Export model
module.exports = mongoose.model('BillingNotification', BillingNotificationSchema);