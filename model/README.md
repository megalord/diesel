# javascript model

## description

The defined Model object is a prototype for creating individual data models in javascript.  The prototype is dependent on an event system, so a basic one has been included in this script.

The purpose is to facilitate live-updated computed properties using getters and setters as opposed to a 'jQuery soup' implementation.  A possible use-case would be replicating excel-like behaviour.

Instances of the model are made with the Model.create() method rather than a function constructor due to personal preference.

Currently, the model does not support complex data types.  That is, getting or setting the property 'obj.prop' does not create or read 'obj' and then look for 'prop' on it.

## methods

#### create()

Create a new model from the prototype.  This method is an alternative pattern to using function constructors, i.e. new Function().

#### define(property, value)

Define a property on the model.  The second parameter may be a static value or a function.  When using a function, other properties of the model must be requested using this.get('property').  For each of these calls, a change event is registered on the property being requested, and the defining function will be re-evaluated when such a change is triggered.

#### get(property)

Retrieve the value of a property on the model.

#### set(property, value)

Set the value of a property on the model.  Setting a new value will cause a change event to be triggered, which may propagate to dependent computed properties of the model.
