<?php
namespace App;

use Nathanmac\Utilities\Parser\Parser;
use GuzzleHttp\Client;

/**
 * Reddit Parser
 *
 * Handles calls to the reddit json endpoint and
 * parses the response.
 *
 * @author awilliams
 *        
 */
class RedditParser
{

    /**
     *
     * @var Client
     */
    protected $client;

    /**
     *
     * @var Parser
     */
    protected $parser;

    /**
     *
     * @var string
     */
    protected $payload;

    protected $base_url = 'https://www.reddit.com/r/';

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->client = new Client([
            'base_url' => $this->base_url,
            'headers' => [
                'User-Agent' => 'creddit/1.0',
                'Accept' => 'application/json'
            ]
        ]);
        
        $this->parser = new Parser();
    }

    /**
     *
     * @param string $payload            
     * @return Array
     */
    protected function getPosts($payload)
    {
        $body = $this->parser->json($payload);
        if (isset($body['data'])) {
            return $body['data'];
        }
        return [];
    }

    /**
     * Handles building of the API request query url.
     *
     * @param string $channel            
     * @param string $category            
     * @param array $args            
     * @return string
     */
    protected function buildUri($channel, $category, $args = [])
    {
        $uri = $this->base_url . $channel . '/';
        if (empty($args['q'])) {
            $uri .= $category;
        } else {
            $uri .= 'search';
        }
        $uri .= '.json';
        if ($args) {
            $uri .= '?' . http_build_query($args);
            if (! empty($args['q'])) {
                $uri .= '&restrict_sr=true';
            }
        }
        
        return $uri;
    }

    /**
     * Initiates the remote request to the reddit API
     * and decodes the response.
     *
     * @param string $channel            
     * @param string $category            
     * @param array $args            
     * @return boolean|array
     */
    public function request($channel, $category, $args = [])
    {
        $uri = $this->buildUri($channel, $category, $args);
        
        /* @var $response /Psr\Http\Message\ResponseInterface */
        try {
            $response = $this->client->request('GET', $uri);
        } catch (\Exception $e) {
            return false;
        }
        if ($response->getStatusCode() == 200) {
            $this->payload = $response->getBody()->getContents();
            return $this->getPosts($this->payload);
        }
        return false;
    }
}

?>