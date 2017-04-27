<?php
namespace App\Controller;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Views\Twig;

class Main
{

    /**
     *
     * @var Twig
     */
    protected $renderer;

    /**
     *
     * @var string
     */
    protected $channel = 'gameofthrones';

    /**
     *
     * @var string
     */
    protected $category = 'hot';

    /**
     *
     * @var integer
     */
    protected $count = 10;

    /**
     *
     * @var integer
     */
    protected $limit = 10;

    public function __construct(Twig $renderer)
    {
        $this->renderer = $renderer;
    }

    protected function generateTitle($request)
    {
        return $this->channel . ' / ' . $this->category;
    }

    public function dispatch(Request $request, Response $response, $args)
    {
        $channel = $request->getAttribute('channel', $this->channel);
        $category = $request->getAttribute('category', $this->category);
        $args['params'] = array_merge([
            'count' => $this->getCount($args),
            'limit' => $this->limit
        ], $request->getQueryParams());
        
        $args['params']['count'] = empty($args['params']['after']) ? 0 : 10;
        
        $this->setCategory($category)->setChannel($channel);
        
        $result = [
            'title' => $this->generateTitle($request),
            'channel' => $channel,
            'category' => $category,
            'args' => $args
        ];
        return $this->renderer->render($response, 'index.twig', $result);
    }

    /**
     *
     * @return string $channel
     */
    public function getChannel()
    {
        return $this->channel;
    }

    /**
     *
     * @return string $category
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     *
     * @param string $channel            
     */
    public function setChannel($channel)
    {
        $this->channel = $channel;
        return $this;
    }

    /**
     *
     * @param string $category            
     */
    public function setCategory($category)
    {
        $this->category = $category;
        return $this;
    }

    /**
     *
     * @return number $count
     */
    public function getCount($args = [])
    {
        return (empty($args['after']) && empty($args['before'])) ? 0 : $this->count;
    }

    /**
     *
     * @return number $limit
     */
    public function getLimit()
    {
        return $this->limit;
    }

    /**
     *
     * @param number $count            
     */
    public function setCount($count)
    {
        $this->count = $count;
        return $this;
    }

    /**
     *
     * @param number $limit            
     */
    public function setLimit($limit)
    {
        $this->limit = $limit;
        return $this;
    }
}

?>