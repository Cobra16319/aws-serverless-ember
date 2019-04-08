/*
* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT-0
*/
import Ember from 'ember';

export default Ember.Controller.extend({
	cognito: Ember.inject.service(),
	authentication: Ember.inject.service(),
	jwt: Ember.computed('authentication', function() {
		var token = this.get('authentication').get('token');
		return window.jwt_decode(token);
	}),
	user: Ember.computed('cognito', function() {
		return this.get('cognito').get('user');
	}),
	actions: {
		createItem() {
			let content = this.get('item');
			if (!content) {
				return alert('Please enter some content');
			}
			let	doc = this.get('store').createRecord('doc', {
					'content': content
				});
			doc.save()
				.then(function(data) {
					Ember.Logger.info(data);
				})
				.catch(function(error) {
					Ember.Logger.error(error);
					doc.deleteRecord();
				});
		},
		removeItem(id) {
			if (confirm('Remove this item?')) {
				this.get('store').findRecord('doc', id, { backgroundReload: false })
					.then(function(doc) {
						doc.deleteRecord();
						doc.save();
					})
					.catch(function(err) {
						Ember.Logger.error(err);
					});
			}
		},
		logout() {
			var ctrl = this;
			this.get('authentication').logout()
				.then(function() {
					ctrl.transitionToRoute('/login');
				});
		}
	}
});
