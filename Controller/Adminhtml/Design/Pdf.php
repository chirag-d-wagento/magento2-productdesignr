<?php

namespace Develodesign\Designer\Controller\Adminhtml\Design;

use Magento\Framework\Stdlib\DateTime\DateTime;
use Magento\Framework\Controller\ResultFactory;

class Pdf extends \Magento\Framework\App\Action\Action{

    protected $_cartDesignModel;
    protected $_ddHelper;
    protected $_logger;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Develodesign\Designer\Model\CartitemFactory $cartDesignModel,
        \Develodesign\Designer\Helper\Data $ddHelper,
        \Psr\Log\LoggerInterface $logger
    ) {
        $this->_ddHelper         = $ddHelper;
        $this->_cartDesignModel  = $cartDesignModel;
        $this->_logger           = $logger;

        parent::__construct($context);
    }

    public function execute() {

        $params = $this->getRequest()->getParams();

        if (!$params || empty($params['item_id'])) {
            $errorMessage =  __('Invalid parameters. No design item id.');
            echo $errorMessage;
            $this->_logger->critical($errorMessage);
            exit;
        }


        $model = $this->_cartDesignModel->create()->load($params['item_id']);

        if (!$model || !$model->getSvgText()) {
            $errorMessage =  __('Design data not found or incomplete. [item_id:'.$params['item_id'].']');
            echo $errorMessage;
            $this->_logger->critical($errorMessage);
            exit;
        }

        $pdf = new \TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        $pdf->SetPrintHeader(false);
        $pdf->SetPrintFooter(false);
        $pdf->AddPage();

        $pdf->ImageSVG('@' . $model->getSvgText(), $x=15, $y=30, $w='', $h='', $link='http://www.tcpdf.org', $align='', $palign='', $border=1, $fitonpage=false);

        $filename = 'dd_designer_item_'.$params['item_id'].'.pdf';

        /*header('Content-Type: application/pdf');
        header('Content-Length: '.strlen( $pdf ));
        header('Content-disposition: inline; filename="' . $filename . '"');
        header('Cache-Control: public, must-revalidate, max-age=0');
        header('Pragma: public');
        header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');
        header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');*/

        echo $pdf->Output($filename, 'I');
        exit;

    }


}
