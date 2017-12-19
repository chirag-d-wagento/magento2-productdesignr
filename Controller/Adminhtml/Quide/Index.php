<?php

namespace Develodesign\Designer\Controller\Adminhtml\Quide;

use Magento\Framework\Stdlib\DateTime\DateTime;

class Index extends \Magento\Backend\App\Action {

    //https://docs.google.com/document/d/1zehh_3XHbRzlpXTA2VSd0Y-S54J1UoLgrjoqszLj3Qw/export?format=docx
    const FILE_ID = '1zehh_3XHbRzlpXTA2VSd0Y-S54J1UoLgrjoqszLj3Qw';
    const FORMAT = 'docx';
    const USER_QUIDE_GOOGLE_DRIVE = 'https://docs.google.com/document/d/';

    public function execute() {
        $this->downloadFromGoogleDrive();
    }
    
    protected function buildUrlDownload() {
        return self::USER_QUIDE_GOOGLE_DRIVE . self::FILE_ID . '/export?format=' . self::FORMAT;
    }

    protected function downloadFromGoogleDrive() {
        $file_url = $this->buildUrlDownload();
        header('Content-Type: application/octet-stream');
        header("Content-Transfer-Encoding: Binary");
        header("Content-disposition: attachment; filename=\"Product-Designer.docx\"");
        readfile($file_url);
    }

}
