const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const prodConfig = require('./webpack.production');
const devConfig = require('./webpack.development');
const env = process.env.NODE_ENV;


const  PATHS = {
    source: path.join(__dirname,'src'),
    build: path.join(__dirname,'public'),
};

const common = {
    entry: PATHS.source+'/index.js',
    output: {
        path: PATHS.build,
        filename:  'js/bundle.js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                minimize: isProduction(),
                                sourceMap: isProduction()
                            }
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: "sass-loader",
                        }
                    ],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'img/',
                            name: '[name].[ext]',
                            publicPath: '/'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts/',
                            name: '[name].[ext]',
                            publicPath: '/'
                        }
                    }
                ]
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '/css/style.css',
            publicPath: PATHS.build,
        }),
        new webpack.ProvidePlugin({
            $:      "jquery",
            jQuery: "jquery"
        })
    ]
};


module.exports = function(env) {

    if (isProduction()) {
        return merge([
            common,
            prodConfig
        ]);
    }

    return merge([
        common,
        devConfig
    ]);
};


function isProduction() {
    return env === 'production';
}
