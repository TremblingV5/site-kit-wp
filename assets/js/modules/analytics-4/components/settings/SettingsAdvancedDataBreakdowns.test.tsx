/**
 * SettingsAdvancedDataBreakdowns tests.
 *
 * Site Kit by Google, Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { WPDataRegistry } from '@wordpress/data/build-types/registry';

/**
 * Internal dependencies
 */
import { CORE_USER } from '@/js/googlesitekit/datastore/user/constants';
import {
	EDIT_SCOPE,
	MODULES_ANALYTICS_4,
	SITE_GOALS_CUSTOM_DIMENSIONS,
} from '@/js/modules/analytics-4/datastore/constants';
import {
	createTestRegistry,
	fireEvent,
	provideSiteInfo,
	provideUserAuthentication,
	render,
	waitFor,
} from '../../../../../../tests/js/test-utils';
import SettingsAdvancedDataBreakdowns from './SettingsAdvancedDataBreakdowns';

describe( 'SettingsAdvancedDataBreakdowns', () => {
	let registry: WPDataRegistry;
	const propertyID = '123456';

	beforeEach( () => {
		registry = createTestRegistry();
		provideSiteInfo( registry );
		provideUserAuthentication( registry, {
			grantedScopes: [ EDIT_SCOPE ],
		} );
		registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {
			propertyID,
			availableCustomDimensions: [],
		} );
	} );

	it( 'shows a progress bar while the setting is loading', () => {
		const { container } = render( <SettingsAdvancedDataBreakdowns />, {
			registry,
		} );

		expect(
			container.querySelector(
				'.googlesitekit-settings-advanced-data-breakdowns--loading'
			)
		).toBeInTheDocument();
	} );

	it( 'renders the Enable button when the setting is off', () => {
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetAdvancedDataBreakdownsSettings( { enabled: false } );

		const { getByRole } = render( <SettingsAdvancedDataBreakdowns />, {
			registry,
		} );

		expect( getByRole( 'button', { name: /enable/i } ) ).toBeInTheDocument();
	} );

	it( 'shows the green tick and hides the Enable button when all dimensions exist', () => {
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetAdvancedDataBreakdownsSettings( { enabled: true } );
		registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {
			propertyID,
			availableCustomDimensions: SITE_GOALS_CUSTOM_DIMENSIONS,
		} );

		const { container, queryByRole } = render(
			<SettingsAdvancedDataBreakdowns />,
			{ registry }
		);

		expect(
			container.querySelector(
				'.googlesitekit-settings-advanced-data-breakdowns__tick'
			)
		).toBeInTheDocument();
		expect(
			queryByRole( 'button', { name: /enable/i } )
		).not.toBeInTheDocument();
	} );

	it( 'triggers the OAuth scope prompt when the edit scope is missing', async () => {
		provideUserAuthentication( registry, { grantedScopes: [] } );
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetAdvancedDataBreakdownsSettings( { enabled: false } );

		const { getByRole } = render( <SettingsAdvancedDataBreakdowns />, {
			registry,
		} );

		fireEvent.click( getByRole( 'button', { name: /enable/i } ) );

		await waitFor( () => {
			const error = registry
				.select( CORE_USER )
				.getPermissionScopeError();
			expect( error?.data?.scopes ).toEqual( [ EDIT_SCOPE ] );
			expect( error?.data?.skipModal ).toBe( true );
		} );
	} );

	it( 'shows the error notice when the save call fails', async () => {
		registry
			.dispatch( MODULES_ANALYTICS_4 )
			.receiveGetAdvancedDataBreakdownsSettings( { enabled: false } );

		const errorPayload = {
			code: 'internal_error',
			message: 'Save failed',
			data: { status: 500 },
		};

		fetchMock.postOnce(
			new RegExp(
				'^/google-site-kit/v1/modules/analytics-4/data/save-advanced-data-breakdowns-settings'
			),
			{ body: errorPayload, status: 500 }
		);

		const { getByRole, getByText } = render(
			<SettingsAdvancedDataBreakdowns />,
			{ registry }
		);

		fireEvent.click( getByRole( 'button', { name: /enable/i } ) );

		await waitFor( () => {
			expect( getByText( 'Save failed' ) ).toBeInTheDocument();
		} );
	} );
} );
