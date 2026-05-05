FROM php:8.3-apache
 
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql
 
RUN a2enmod rewrite

# Ensure AllowOverride is enabled so .htaccess rewrite rules work
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf
 
COPY . /var/www/html/

WORKDIR /var/www/html/ 

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80