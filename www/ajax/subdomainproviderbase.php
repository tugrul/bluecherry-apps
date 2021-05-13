<?php

class subdomainproviderbase extends Controller {

    const API_BASE_URL_NAME = 'G_SUBDOMAIN_API_BASE_URL';

    public function __construct() {
        parent::__construct();
        $this->chAccess('admin');
    }

    public function getData() {
        return $this->getNotImplementedResponse();
    }

    public function postData() {
        return $this->getNotImplementedResponse();
    }

    protected function getNotImplementedResponse() {
        return json_encode([
            'success' => false,
            'message' => 'this request method is not implemented'
        ]);
    }

    protected function getSubdomainApiBaseUrl() {
        $result = data::query('SELECT `value` FROM `GlobalSettings` WHERE `parameter` = \'' .
            self::API_BASE_URL_NAME . '\' LIMIT 1');

        if (empty($result)) {
            throw new \RuntimeException(self::API_BASE_URL_NAME .
                ' parameter is not defined in global settings');
        }

        return $result;
    }

    protected function getLicenseId() {
        // TODO: get license id from cryptlex configuration
        // TODO: throw an \RuntimeException if license id is not exists
    }

    protected function postToApi($path, $body, $headers = []) {

        $baseUrl = $this->getSubdomainApiBaseUrl();

        $curl = curl_init($baseUrl . $path);

        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 4);
        curl_setopt($curl,CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($body));
        curl_setopt($curl, CURLOPT_HTTPHEADER, array_merge(['Content-Type: application/json'], $headers));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

        $result = curl_exec($curl);

        curl_close($curl);


        if ($result === false) {
            throw new \RuntimeException('api request is failed');
        }

        return json_decode($result, true);
    }

    protected function postToApiWithToken($path, $body, $headers = [], $tokenOptional = false) {
        try {
            $licenseId = $this->getLicenseId();
        } catch (\RuntimeException $exception) {

            if ($tokenOptional) {
                return $this->postToApi($path, $body, $headers);
            }

            throw $exception;
        }

        return $this->postToApi($path, $body, array_merge([
            'Authorization: Bearer ' . $licenseId
        ], $headers));
    }

    protected function getFromApi($path, $query = [], $headers = []) {

        $baseUrl = $this->getSubdomainApiBaseUrl();

        if (!empty($query)) {
            $path .= http_build_query($query);
        }

        $curl = curl_init($baseUrl . $path);

        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 4);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array_merge(['Content-Type: application/json'], $headers));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

        $result = curl_exec($curl);

        curl_close($curl);


        if ($result === false) {
            throw new \RuntimeException('api request is failed');
        }

        return json_decode($result, true);
    }

    protected function getFromApiWithToken($path, $query = [], $headers = [], $tokenOptional = false) {

        try {
            $licenseId = $this->getLicenseId();
        } catch (\RuntimeException $exception) {

            if ($tokenOptional) {
                return $this->getFromApi($path, $query, $headers);
            }

            throw $exception;
        }

        return $this->getFromApi($path, $query, array_merge([
            'Authorization: Bearer ' . $licenseId
        ], $headers));

    }

}



?>
