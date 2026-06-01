/**
 * SettingsAdvancedDataBreakdowns component.
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
 * External dependencies
 */
import { FC } from 'react';

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button, ProgressBar } from 'googlesitekit-components';
import { Select, useDispatch, useSelect } from 'googlesitekit-data';
import Notice from '@/js/components/Notice';
import { NOTICE_TYPES } from '@/js/components/Notice/constants';
import { CORE_USER } from '@/js/googlesitekit/datastore/user/constants';
import useFormValue from '@/js/hooks/useFormValue';
import {
	EDIT_SCOPE,
	MODULES_ANALYTICS_4,
	SITE_GOALS_CUSTOM_DIMENSIONS,
} from '@/js/modules/analytics-4/datastore/constants';
import { ERROR_CODE_MISSING_REQUIRED_SCOPE } from '@/js/util/errors';
import StarFill from '@/svg/icons/star-fill.svg';
import Tick from '@/svg/icons/tick.svg';

export const ADVANCED_DATA_BREAKDOWNS_FORM = 'advancedDataBreakdownsForm';

const SettingsAdvancedDataBreakdowns: FC = () => {
	const [ saveError, setSaveError ] = useState< { message: string } | null >(
		null
	);

	const isSettingsLoaded = useSelect(
		( select: Select ) =>
			select( MODULES_ANALYTICS_4 ).isAdvancedDataBreakdownsEnabled() !==
			undefined
	);

	const isAdvancedDataBreakdownsEnabled = useSelect( ( select: Select ) =>
		select( MODULES_ANALYTICS_4 ).isAdvancedDataBreakdownsEnabled()
	);

	const hasAllCustomDimensions = useSelect( ( select: Select ) =>
		select( MODULES_ANALYTICS_4 ).hasCustomDimensions(
			SITE_GOALS_CUSTOM_DIMENSIONS
		)
	);

	const hasEditScope = useSelect( ( select: Select ) =>
		select( CORE_USER ).hasScope( EDIT_SCOPE )
	);

	const [ autoSubmit, setAutoSubmit ] = useFormValue(
		ADVANCED_DATA_BREAKDOWNS_FORM,
		'autoSubmit'
	);

	const isSaving = useSelect( ( select: Select ) =>
		select(
			MODULES_ANALYTICS_4
		).isFetchingSaveAdvancedDataBreakdownsSettings()
	);

	const isCreatingDimensions = useSelect( ( select: Select ) => {
		const customDimensionsBeingCreated = SITE_GOALS_CUSTOM_DIMENSIONS.some(
			( dimension ) =>
				select( MODULES_ANALYTICS_4 ).isCreatingCustomDimension(
					dimension
				)
		);

		return (
			customDimensionsBeingCreated ||
			select( MODULES_ANALYTICS_4 ).isSyncingAvailableCustomDimensions()
		);
	} );

	const {
		setAdvancedDataBreakdownsEnabled,
		saveAdvancedDataBreakdownsSettings,
		createCustomDimensions,
	} = useDispatch( MODULES_ANALYTICS_4 );
	const { setPermissionScopeError } = useDispatch( CORE_USER );

	const enableAndCreate = useCallback( async () => {
		setSaveError( null );
		setAdvancedDataBreakdownsEnabled( true );

		const { error } = await saveAdvancedDataBreakdownsSettings();

		if ( error ) {
			setSaveError( error );
			return;
		}

		createCustomDimensions();
	}, [
		setAdvancedDataBreakdownsEnabled,
		saveAdvancedDataBreakdownsSettings,
		createCustomDimensions,
	] );

	const handleEnable = useCallback( () => {
		if ( hasEditScope === false ) {
			setAutoSubmit( true );

			setPermissionScopeError( {
				code: ERROR_CODE_MISSING_REQUIRED_SCOPE,
				message: __(
					'Additional permissions are required to create the custom dimensions needed for the Site Goals widget.',
					'google-site-kit'
				),
				data: {
					status: 403,
					scopes: [ EDIT_SCOPE ],
					skipModal: true,
				},
			} );
			return;
		}

		enableAndCreate();
	}, [
		enableAndCreate,
		hasEditScope,
		setAutoSubmit,
		setPermissionScopeError,
	] );

	useEffect( () => {
		if ( autoSubmit && hasEditScope ) {
			setAutoSubmit( false );
			enableAndCreate();
		}
	}, [ autoSubmit, enableAndCreate, hasEditScope, setAutoSubmit ] );

	if ( ! isSettingsLoaded ) {
		return (
			<div className="googlesitekit-settings-advanced-data-breakdowns googlesitekit-settings-advanced-data-breakdowns--loading">
				<ProgressBar small />
			</div>
		);
	}

	const isComplete =
		isAdvancedDataBreakdownsEnabled && hasAllCustomDimensions === true;

	return (
		<div className="googlesitekit-settings-advanced-data-breakdowns">
			<div className="googlesitekit-settings-advanced-data-breakdowns__row">
				<div className="googlesitekit-settings-advanced-data-breakdowns__icon">
					{ isComplete ? (
						<div className="googlesitekit-settings-advanced-data-breakdowns__tick">
							<Tick />
						</div>
					) : (
						<StarFill />
					) }
				</div>

				<div className="googlesitekit-settings-advanced-data-breakdowns__content">
					<p className="googlesitekit-settings-advanced-data-breakdowns__title">
						{ __( 'Custom Dimensions', 'google-site-kit' ) }
					</p>
					<p className="googlesitekit-module-settings-group__helper-text">
						{ __(
							'Enable custom dimensions to unlock the Site Goals widget and richer breakdowns for your content.',
							'google-site-kit'
						) }
					</p>
				</div>

				{ ! isComplete && (
					<div className="googlesitekit-settings-advanced-data-breakdowns__action">
						<Button
							onClick={ handleEnable }
							disabled={ isSaving || isCreatingDimensions }
							inProgress={ isSaving || isCreatingDimensions }
						>
							{ __( 'Enable', 'google-site-kit' ) }
						</Button>
					</div>
				) }
			</div>

			{ saveError && (
				<Notice
					type={ NOTICE_TYPES.ERROR }
					description={ saveError.message }
					ctaButton={ {
						label: __( 'Retry', 'google-site-kit' ),
						onClick: enableAndCreate,
					} }
				/>
			) }
		</div>
	);
};

export default SettingsAdvancedDataBreakdowns;
