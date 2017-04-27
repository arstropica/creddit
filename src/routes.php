<?php
// Routes
$app->get('/', 'controller.main:dispatch');
$app->get('/api/get/{channel}/[{category}/]', 'controller.api:dispatch');
$app->get('/api/get/', 'controller.api:dispatch');
$app->get('/{channel}/[{category}/]', 'controller.main:dispatch');

