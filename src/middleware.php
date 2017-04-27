<?php
// Application middleware

use Psr7Middlewares\Middleware\TrailingSlash;

$app->add(new TrailingSlash(true)); // true adds the trailing slash (false removes it)
