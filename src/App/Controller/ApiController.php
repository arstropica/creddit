<?php
namespace App\Controller;

use App\RedditParser as Parser;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use App\Controller\Main;

/**
 * API Requests Controller
 *
 * @author awilliams
 *        
 */
class ApiController extends Main
{

    /**
     *
     * @var Parser
     */
    protected $parser;

    /**
     *
     * @var string
     */
    public $defaultChannel = 'gameofthrones';

    /**
     *
     * @var string
     */
    public $defaultCategory = 'hot';

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->parser = new Parser();
    }

    /**
     * Handles API requests
     *
     * {@inheritdoc}
     *
     * @see \App\Controller\Main::dispatch()
     */
    public function dispatch(Request $request, Response $response, $args)
    {
        $parser = $this->parser;
        
        $channel = $request->getAttribute('channel', $this->defaultChannel);
        
        $category = $request->getAttribute('category', $this->defaultCategory);
        
        $args['params'] = array_merge([
            'count' => $this->getCount($args),
            'limit' => $this->limit
        ], $request->getQueryParams());
        
        $body = $parser->request($channel, $category, $args['params']);
        
        $result = [
            'output' => $body,
            'args' => $args
        ];
        
        // Render json view
        return $response->withJson($result);
    }
}

?>