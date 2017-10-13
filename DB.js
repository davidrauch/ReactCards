import SQLite from 'react-native-sqlite-storage';

export default class DB {

  constructor() {
    // Open database
    this._db = SQLite.openDatabase(
      {
        name : 'words.db',
        createFromLocation : 1,
        location: 'Documents',
      },
      () => {
        console.log('DB: Successfuly opened database');
      },
      (err) => {
        console.error('DB: Error opening database: {err}');
      });
  }

  _runQuery = (query, callback) => {
    this._db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        callback(results);
      });
    });
  }

  getNextWord = (callback) => {
    let random_level = Math.random() * 16;
    let level = 1;
    if (random_level < 10) {
      level = 1;
    } else if (random_level < 10) {
      level = 2;
    } else if (random_level < 13) {
      level = 3;
    } else if (random_level < 15) {
      level = 4;
    } else if (random_level < 16) {
      level = 5;
    }

    this._runQuery(`SELECT id, ru, en, type, gender, aspect, marked, level, repeats_in_level, last_repeated FROM words WHERE level=${level} AND enabled=1 ORDER BY last_repeated ASC, RANDOM() LIMIT 1`, (results) => {
      if(results.rows.length > 0) {
        callback(results.rows.item(0));
      } else {
        console.log('DB: No row selected for query');
        this.getNextWord(callback);
      }
    });
  }

  _registerWordRepeat = (word, callback) => {
    this._runQuery(`UPDATE words SET level=${word.level}, repeats_in_level=${word.repeats_in_level}, last_repeated=strftime('%s', 'now') WHERE id=${word.id}`, callback)
  }

  registerWordCorrect = (word, callback) => {
    word.repeats_in_level++;
    if(word.level == 1 && word.repeats_in_level >= 1) {
      word.level = 2;
      word.repeats_in_level = 0;
    } else if (word.level == 2 && word.repeats_in_level >= 2) {
      word.level = 3;
      word.repeats_in_level = 0;
    } else if (word.level == 3 && word.repeats_in_level >= 3) {
      word.level = 4;
      word.repeats_in_level = 0;
    } else if (word.level == 4 && word.repeats_in_level >= 4) {
      word.level = 5;
      word.repeats_in_level = 0;
    }

    this._registerWordRepeat(word, callback);
  }

  registerWordWrong = (word, callback) => {
    word.level = Math.max(1, word.level-1);
    word.repeats_in_level = 0;

    this._registerWordRepeat(word, callback);
  }

  markWord = (word, callback) => {
    this._runQuery(`UPDATE words SET marked=1 WHERE id=${word.id}`, callback);
  }

  addWord = (word, callback) => {
    this._runQuery(`INSERT INTO words (ru, marked, enabled) VALUES('${word}', 1, 0)`, callback);
  }

}
