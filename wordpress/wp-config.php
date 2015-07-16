<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link https://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'portfoliov4');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'O;B.(O~Ii=;`Y|-r|,NF^2^#-,tkv6)!Vgu[j3J~`4z(d[3.Z njos)$0?H.%/C]');
define('SECURE_AUTH_KEY',  '2157.;:We+p$`DTaAf{sR+8EfBlhLRkZua;U=D5G ,(@J]-,YUq1#nukN@W?;FZm');
define('LOGGED_IN_KEY',    '|+=a0_{?RNlG=c|oq.N8yYxR?b*l,p49YLhx5o-kAh~-C<0u=.Kqhd(K-gE|AI I');
define('NONCE_KEY',        'K[|8WI]+IkGd4-|F>|8{vIx!kpr9L eX:PA6H;_IFIFB;&!${f0JUQe7ySC<q0;h');
define('AUTH_SALT',        '->^W&F9:Tm3Vh`,o<QXZ>$2f2|L8p{QZHX- e_*{[i4Z:,*:V+Mw.jbk>KEooscI');
define('SECURE_AUTH_SALT', '0l^;I&(Bo~x?N2}U| 4C]&3l@pkmH)FK8yAc]4S|gnc3XKLRrCPB~p[,MXuF0S5,');
define('LOGGED_IN_SALT',   'YW4aE(~#Ems3|EUVExeh}BB^_Aefb$dW<UN5f7?j|T83QB{$Rhk7pH4W9u6QuMBp');
define('NONCE_SALT',       '[Iy/n&:nheDWh%_u2cy0!trMV[/^#iQDt),M&a|pmk{o}+_%*4mK=HP,2;?Vgl2r');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
