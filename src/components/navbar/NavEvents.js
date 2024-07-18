export default {
    //Editor
    UNDO_EVENT: 'editor:undo',
    REDO_EVENT: 'editor:redo',
    TCODE_EVENT: 'editor:toggleCode',
    TTHEME_EVENT: 'editor:toggleTheme',

    //File
    SAVE_EVENT: 'file:save',
    SAVE_CLOSE_EVENT: 'file:save:close',
    FORCE_CLOSE_PROJECT_EVENT: 'file:close:forced',
    DOWNLOAD_PROJECT_EVENT: "file:download",

    //Programming
    SEARCH_PORT_EVENT: 'prog:searchPort',
    RUN_EVENT: 'prog:compileUpload',

    //About
    ABOUT_INFO_EVENT: 'about:toggle'
};