// helper functions to be used with handlebars view engine
const moment = require('moment');

// truncate the string in specific length
const truncate = (str, len) => {
    if (str.length > len && str.length > 0)
    {
        let new_str;
        new_str = str.substring(0, len);
        new_str = str.substring(0, new_str.lastIndexOf(" "));
        new_str = (new_str.length > 0) ? new_str : str.substring(0, len);
        return new_str + '...';
    }
    return str;
}

// use regex to strip any html tags
const stripTags = (input) => {
    return input.replace(/<(?:.|\n)*?>/gm, '');
}

const formatDate = (date, format) => {
    return moment(date).format(format);
}

// used to handle select option in edit story form
const select = (selected, options) => {
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), 
    '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), 
    ' selected="selected"$&');
}

// used to handle edit Icon in stories page and edit story page
const editIcon = (storyUser, loggedUser, storyId, floating = true) => {
    if (storyUser === loggedUser)
    {
        if (floating)
        {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red">
            <i class="fa fa-pencil"></i></a>`;
        }
        else
        {
            return `<a href="/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
        }
    }
    else
    {
        return '';
    }
}

module.exports = {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
}