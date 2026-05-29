<?php
/**
 * Class Google\Site_Kit\Modules\Analytics_4\Advanced_Data_Breakdowns_Settings
 *
 * @package   Google\Site_Kit\Modules\Analytics_4
 * @copyright 2026 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\Analytics_4;

use Google\Site_Kit\Core\Storage\Setting;
use Google\Site_Kit\Core\Storage\Setting_With_ViewOnly_Keys_Interface;

/**
 * Class for Advanced_Data_Breakdowns_Settings.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Advanced_Data_Breakdowns_Settings extends Setting implements Setting_With_ViewOnly_Keys_Interface {

	/**
	 * The option name for this setting.
	 */
	const OPTION = 'googlesitekit_analytics-4_advanced_data_breakdowns';

	/**
	 * Gets the default value for the setting.
	 *
	 * @since n.e.x.t
	 *
	 * @return array Default value.
	 */
	public function get_default() {
		return array(
			'enabled' => false,
		);
	}

	/**
	 * Gets the type of the setting.
	 *
	 * @since n.e.x.t
	 *
	 * @return string The type of the setting.
	 */
	public function get_type() {
		return 'object';
	}

	/**
	 * Gets the callback for sanitizing the setting's value before saving.
	 *
	 * @since n.e.x.t
	 *
	 * @return callable Sanitize callback.
	 */
	protected function get_sanitize_callback() {
		return function ( $option ) {
			$new_option = $this->get();

			if ( ! is_array( $option ) ) {
				return $new_option;
			}

			if ( isset( $option['enabled'] ) ) {
				$new_option['enabled'] = (bool) $option['enabled'];
			}

			return $new_option;
		};
	}

	/**
	 * Gets the view-only keys for the setting.
	 *
	 * @since n.e.x.t
	 *
	 * @return array List of view-only keys.
	 */
	public function get_view_only_keys() {
		return array( 'enabled' );
	}

	/**
	 * Checks whether advanced data breakdowns is enabled.
	 *
	 * @since n.e.x.t
	 *
	 * @return bool True when enabled, false otherwise.
	 */
	public function is_enabled() {
		$settings = $this->get();

		return ! empty( $settings['enabled'] );
	}

	/**
	 * Merges the given settings with the existing ones. Keeps existing values
	 * for keys not present in the given settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param array $settings Settings to merge.
	 * @return array Merged settings.
	 */
	public function merge( $settings ) {
		$existing_settings = $this->get();
		$updated_settings  = array_merge( $existing_settings, $settings );

		$this->set( $updated_settings );

		return $updated_settings;
	}
}
