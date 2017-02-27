const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

const notes = require('./notes.js');

const title = {
  describe: 'Title of note',
  demand: true,
  alias: 't'
};
const body = {
  describe: 'Body of note',
  demand: true,
  alias: 'b'
};
const argv = yargs
  .command('add', 'Adds a new note', { title, body })
  .command('remove', 'Removes a note', { title })
  .command('read', 'Reads a note', { title })
  .command('list', 'Lists all notes', {})
  .help()
  .argv;
var command = argv._[0];

if (command === 'add') {
  var note = notes.addNote(argv.title, argv.body);
  if (note) {
    console.log('Note added:');
    console.log(notes.formatNote(note));
  } else {
    console.log('Error: note title already in use');
  }
} else if (command === 'remove') {
  var isRemoved = notes.removeNote(argv.title);
  console.log(isRemoved ? 'Note removed' : 'Error: note not found');
} else if (command === 'read') {
  var note = notes.getNote(argv.title);
  if (note) {
    console.log('Note found:');
    console.log(notes.formatNote(note));
  } else {
    console.log('Error: note not found');
  }
} else if (command === 'list') {
  var allNotes = notes.getAllNotes();
  var count = allNotes.length;
  if (count > 0) {
    console.log(`Listing ${count} note${count > 1 ? 's' : ''}:`);
    allNotes.forEach((note) => console.log(notes.formatNote(note)));
  } else {
    console.log('No notes found');
  }
} else {
  console.log('Command not recognized');
}
