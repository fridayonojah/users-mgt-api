/**
 * This function is mainly for setting our columes in our models files
 * example 
 * name = ?
 * @params object
 */
exports.multipleColumeSet = (object) => {
    // check if an object was given from the body of the request
    if(typeof object !== 'object'){
        throw new Error('Invalid input');
    }

    //Get the keys and values from the object param

    const keys = Object.keys(object);
    const values = Object.values(object);

    setColumn = keys.map(Key => `${Key} = ?`).join(', ');

    return {
        setColumn,
        values
    }
}