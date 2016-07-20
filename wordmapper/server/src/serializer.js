var winston = require('winston');
var _ = require('lodash');

/**
 * Serializer.
 *
 * Takes data from the database and serializes or converts it into a standard
 * format for output to clients.
 */
var Serializer = function(data, options) {
	this.rows = data;  // expected to come from database
	this.options = options || {};
	this.output = null;
};
Serializer.prototype.asPromise = function() {
	var serializer = this;
	return new Promise(function(resolve, reject) {
		try {
			serializer.serialize();
			resolve(serializer.output);
		} catch (e) {
			reject(e);
		}
	});
};
Serializer.prototype.serialize = function() {
    this._serialize();
    return this;
};

/**
 * AlignmentsSerializer
 */
var AlignmentsSerializer = function(data, options) {
  Serializer.call(this, data, options);
};
_.assign(AlignmentsSerializer.prototype, Serializer.prototype);

AlignmentsSerializer.prototype._serialize = function() {
	if (!Array.isArray(this.rows)) {
		throw "Expected row data as type 'array' but got something else"
	}

	var dict = this.rows.reduce(function(dict, row, rows) {
		var id = row.alignment_id;
		if(dict.hasOwnProperty(id)) {
			dict[id].push(row);
		} else {
			dict[id] = [row];
		}
		return dict;
	}, {});

	var output = {
		"type": "alignments",
		"data": []
	};

	output.data = Object.keys(dict).map(function(alignmentId) {
		var alignment = {
			"type": "alignment",
			"id": alignmentId,
			"data": []
		};
		alignment.data = dict[alignmentId].map(function(row) {
			return {
				"type": "word",
				"id": row.word_id,
				"data": {
						"index": row.word_index,
						"source": row.source_hash,
						"value": row.word_value
				}
			};
		});
		if(dict[alignmentId][0].comment) {
			alignment.data.push({
				"type": "comment",
				"data": {
						"text": dict[alignmentId][0].comment
				}
			});
		}
		return alignment;
	});

	this.output = output;
	return this;
};

/**
 * SourcesSerializer
 */
var SourcesSerializer = function(data, options) {
  Serializer.call(this, data, options);
};
_.assign(SourcesSerializer.prototype, Serializer.prototype);

SourcesSerializer.prototype._serialize = function() {
	if (!Array.isArray(this.rows)) {
		throw "Expected row data as type 'array' but got something else"
	}
	var options = this.options;
	var output = {
		"type": "sources",
		"data": []
	};

	output.data = this.rows.map(function(source) {
		var data = source;
		if (options.fields) {
			data = options.fields.reduce(function(data, field) {
				data[field] = source[field];
				return data;
			}, {});
		}
		return {
			"type": "source",
			"data": data
		};
	});
	
	this.output = output;
	return this;
};

module.exports.AlignmentsSerializer = AlignmentsSerializer;
module.exports.SourcesSerializer = SourcesSerializer;
