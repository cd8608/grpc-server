const locationSchema = {
    name: 'location',
    type: 'record',
    fields: [
        {
            name: 'lon',
            type: 'double'
        }, {
            name: 'lat',
            type: 'double'
        }]
};

const avro = require('avsc');
const locationSchemaType = avro.parse(locationSchema);

module.exports = locationSchemaType;