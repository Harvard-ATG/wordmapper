var winston = require('winston');

var AlignmentsSerializer = function(data) {
	this.rows = data;  // expected to come from database
	this.output = null;
};
AlignmentsSerializer.prototype.asPromise = function() {
	var serializer = this;
	return new Promise(function(resolve, reject) {
		try {
			resolve(serializer.serialize().output);
		} catch (e) {
			reject(e);
		}
	});
};
AlignmentsSerializer.prototype.serialize = function() {
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

module.exports.AlignmentsSerializer = AlignmentsSerializer;
