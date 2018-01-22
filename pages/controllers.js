module.exports.index = function (req, res) {
    res.send(`
        <html>
            <head>
                <title>Shri 2018</title>
                <link rel="stylesheet" href="css/style.css">              
            </head>
            <body>          
            <div id="root"></div>
            <script src="js/bundle.js"></script>
            </body>
            
        </html>
    `);
};
