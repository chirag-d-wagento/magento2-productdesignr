<?php

namespace Develo\Designer\Model;

class Designer{
    
    public function prepareConfig($imgArr) {
        $saveArr = [];
        $saveArr['sizes'] = $imgArr['sizes'];
        $saveArr['mask'] = $imgArr['mask'];
        $saveArr['conf'] = $imgArr['conf'];
        
        return json_encode($saveArr);
    }
    
}
