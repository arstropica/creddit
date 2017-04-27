<?php
namespace App;

use Nathanmac\Utilities\Parser\Parser;
use GuzzleHttp\Client;

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

    protected function getPosts($payload)
    {
        $body = $this->parser->json($payload);
        if (isset($body['data'])) {
            return $body['data'];
        }
        return [];
    }

    public function request($channel, $category, $args = [])
    {
        $uri = $this->base_url . $channel . '/';
        $uri .= empty($args['q']) ? $category : 'search';
        $uri .= '.json' . ($args ? '?' . http_build_query($args) : '');
        $uri .= empty($args['q']) ? '' : '&restrict_sr=true';
        
        /* @var $response /Psr\Http\Message\ResponseInterface */
        try {
            $response = $this->client->request('GET', $uri);
        } catch (\Exception $e) {
            print_r($e->getMessage());
            return false;
        }
        if ($response->getStatusCode() == 200) {
            $this->payload = $response->getBody()->getContents();
            return $this->getPosts($this->payload);
        } else {
            print_r($response->getStatusCode());
        }
        return false;
    }
}

?>