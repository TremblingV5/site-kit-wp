<?php
/**
 * Class Google\Site_Kit\Modules\Analytics_4\Datapoints\Save_Advanced_Data_Breakdowns_Settings
 *
 * @package   Google\Site_Kit\Modules\Analytics_4\Datapoints
 * @copyright 2026 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\Analytics_4\Datapoints;

use Google\Site_Kit\Core\Modules\Datapoint;
use Google\Site_Kit\Core\Modules\Executable_Datapoint;
use Google\Site_Kit\Core\Permissions\Permissions;
use Google\Site_Kit\Core\REST_API\Data_Request;
use Google\Site_Kit\Core\REST_API\Exception\Invalid_Param_Exception;
use Google\Site_Kit\Modules\Analytics_4\Advanced_Data_Breakdowns_Settings;
use WP_Error;

/**
 * Class for the advanced data breakdowns settings save datapoint.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Save_Advanced_Data_Breakdowns_Settings extends Datapoint implements Executable_Datapoint {

	/**
	 * Advanced_Data_Breakdowns_Settings instance.
	 *
	 * @since n.e.x.t
	 * @var Advanced_Data_Breakdowns_Settings
	 */
	private $advanced_data_breakdowns_settings;

	/**
	 * Constructor.
	 *
	 * @since n.e.x.t
	 *
	 * @param array $definition Definition fields.
	 */
	public function __construct( array $definition ) {
		parent::__construct( $definition );
		$this->advanced_data_breakdowns_settings = $definition['advanced_data_breakdowns_settings'];
	}

	/**
	 * Creates a request object.
	 *
	 * @since n.e.x.t
	 *
	 * @param Data_Request $data_request Data request object.
	 * @return callable|WP_Error Closure that saves the settings, or WP_Error on failure.
	 * @throws Invalid_Param_Exception Thrown when a parameter is invalid.
	 */
	public function create_request( Data_Request $data_request ) {
		if ( ! current_user_can( Permissions::MANAGE_OPTIONS ) ) {
			return new WP_Error(
				'forbidden',
				__( 'User does not have permission to save advanced data breakdowns settings.', 'google-site-kit' ),
				array( 'status' => 403 )
			);
		}

		$settings = $data_request['settings'];

		if ( isset( $settings['enabled'] ) && ! is_bool( $settings['enabled'] ) ) {
			throw new Invalid_Param_Exception( 'enabled' );
		}

		$advanced_data_breakdowns_settings = $this->advanced_data_breakdowns_settings;

		return function () use ( $settings, $advanced_data_breakdowns_settings ) {
			$new_settings = array();

			if ( isset( $settings['enabled'] ) ) {
				$new_settings['enabled'] = $settings['enabled'];
			}

			return $advanced_data_breakdowns_settings->merge( $new_settings );
		};
	}

	/**
	 * Parses a response.
	 *
	 * @since n.e.x.t
	 *
	 * @param mixed        $response Request response.
	 * @param Data_Request $data     Data request object.
	 * @return mixed The response without any modifications.
	 */
	public function parse_response( $response, Data_Request $data ) {
		return $response;
	}
}
