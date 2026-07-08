FROM php:7.4-cli-alpine

# Install PDO MySQL extension for DB connectivity
RUN docker-php-ext-install pdo pdo_mysql

# Copy composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy all application files
COPY . .

# Run composer installation
RUN composer install --no-dev --optimize-autoloader

# Set entry point
CMD php artisan serve --host=0.0.0.0 --port=$PORT
