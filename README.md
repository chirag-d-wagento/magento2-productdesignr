![Magento 2 Product DesignR](https://designr.develo.design/designer-demo.png)

# Magento 2 - Product Designer

A product designer tool for Magento 2, this extension allows you to sell personalised products on your Magento store. A new 'Customize' button will appear on products, which then allows the site user to customise on top of the product image. Customers can add Text, Graphics, and Images,  personalising it as they need.  The Customize button can be turned on for all products or only certain attribute sets.  

## Demo

[Demo TShirt](https://designr.develo.design/t-shirt.html)

[Demo Bag](https://designr.develo.design/rival-field-messenger.html)

[Demo Photoframe](https://designr.develo.design/oak-frame-for-wife.html)


## Demo
![Magento 2 Product DesignR Demo](https://designr.develo.design/designer-demo-gif.gif)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Has been tested with Magento 2.1 & 2.2

### Installing

```bash
$ composer require develodesign/designer
```

## Deployment
```bash
php bin/magento module:enable Develodesign_Designer

php bin/magento setup:upgrade

php bin/magento setup:di:compile
```

## Built With

* [Gulp]
* [Less]
* [FabricJs]

## Contributing

Please read [CONTRIBUTING.md]

## Documentation
TODO

## Authors

* **Yaroslav Trokhlibov** - (yaroslav@develodesign.co.uk)

## License

This project is licensed under the OSL-3.0 License

https://www.develodesign.co.uk
