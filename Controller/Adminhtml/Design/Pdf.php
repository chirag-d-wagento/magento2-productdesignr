<?php

namespace Develodesign\Designer\Controller\Adminhtml\Design;

use Magento\Framework\Stdlib\DateTime\DateTime;
use Magento\Framework\Controller\ResultFactory;

use Magento\Framework\App\Filesystem\DirectoryList;


class Pdf extends \Magento\Framework\App\Action\Action{

    protected $_cartDesignModel;
    protected $_ddHelper;
    protected $_logger;

    protected $_filesystem;
    protected $fileFactory;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Develodesign\Designer\Model\CartitemFactory $cartDesignModel,
        \Develodesign\Designer\Helper\Data $ddHelper,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Filesystem $filesystem,
        \Magento\Framework\App\Response\Http\FileFactory $fileFactory
    ) {
        $this->_ddHelper         = $ddHelper;
        $this->_cartDesignModel  = $cartDesignModel;
        $this->_logger           = $logger;
        $this->_filesystem       = $filesystem;

        $this->fileFactory           = $fileFactory;

        parent::__construct($context);
    }

    public function execute() {

        $params = $this->getRequest()->getParams();

        if (!$params || empty($params['item_id'])) {
            $errorMessage =  __('Invalid parameters. No design item id.');
            $this->messageManager->addErrorMessage($errorMessage);
            $this->_logger->critical($errorMessage);
            return $this->_redirect('adminhtml/*/*');
        }


        $model = $this->_cartDesignModel->create()->load($params['item_id']);

        if (!$model || !$model->getSvgText()) {
            $errorMessage =  __('Design data not found or incomplete. [item_id:'.$params['item_id'].']');

            $this->messageManager->addErrorMessage($errorMessage);
            $this->_logger->critical($errorMessage);

            $this->_logger->critical($errorMessage);
            return $this->_redirect('adminhtml/*/*');
        }
        $pdf = new \TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        $pdf->SetPrintHeader(false);
        $pdf->SetPrintFooter(false);

        $pdf->AddPage();

        $pdf->ImageSVG('@' . $model->getSvgText(), $x=5, $y=5, $w='', $h='', $link='', $align='', $palign='', $border=0, $fitonpage=false);

        $fileName = 'dd_designer_item_' . intval($params['item_id']) . '.pdf';
        return $this->fileFactory->create(
            $fileName,
            $pdf->Output($fileName, 'I'),
            DirectoryList::VAR_DIR,
            'application/pdf'
        );

    }
}
