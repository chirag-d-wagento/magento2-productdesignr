<?php
namespace Develodesign\Designer\Core\Quote\Model;

class Quote {

  protected $_logger;

  protected $_request;

  public function __construct(
    \Psr\Log\LoggerInterface $logger,
    \Magento\Framework\App\RequestInterface $request

  ) {
    $this->_logger = $logger;
    $this->_request = $request;
  }

  public function aroundGetItemByProduct($subject, $proceed, $product){
    $this->_logger->debug('OVERRIDE QUOTE 2?');
    //$returnItem = $proceed($product);

    $designsIds = $this->_request->getParam('dd_design');
    foreach ($subject->getAllItems() as $item) {
        if ($item->representProduct($product) && !$item->getDesignId() && !$designsIds) {
            return $item;
        }
    }

    //return $returnItem;
  }

}
