/**
 * MeasurementSettingRow component.
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
import { FC, ReactNode } from 'react';

/**
 * Internal dependencies
 */
import { ProgressBar } from 'googlesitekit-components';
import StarFill from '@/svg/icons/star-fill.svg';
import Tick from '@/svg/icons/tick.svg';

interface MeasurementSettingRowProps {
	/**
	 * Whether the setting is on. Shows the green tick and hides the action when true, the star and the action when false.
	 */
	isEnabled?: boolean;
	/**
	 * Whether the setting is still loading. Shows a spinner instead of the row.
	 */
	loading?: boolean;
	/**
	 * The row title (eg. "Advanced data breakdowns").
	 */
	title: string;
	/**
	 * The helper text under the title, usually with a "Learn more" link.
	 */
	description: ReactNode;
	/**
	 * The action to show while the setting is off, usually an Enable button. Hidden once the setting is on.
	 */
	action?: ReactNode;
}

const MeasurementSettingRow: FC< MeasurementSettingRowProps > = ( {
	isEnabled = false,
	loading = false,
	title,
	description,
	action = null,
} ) => {
	if ( loading ) {
		return (
			<div className="googlesitekit-settings-measurement-row googlesitekit-settings-measurement-row--loading">
				<ProgressBar small />
			</div>
		);
	}

	return (
		<div className="googlesitekit-settings-measurement-row">
			<div className="googlesitekit-settings-measurement-row__row">
				<div
					className={
						isEnabled
							? 'googlesitekit-settings-measurement-row__tick'
							: 'googlesitekit-settings-measurement-row__icon'
					}
				>
					{ isEnabled ? <Tick /> : <StarFill /> }
				</div>

				<div className="googlesitekit-settings-measurement-row__content">
					<p className="googlesitekit-settings-measurement-row__title">
						{ title }
					</p>
					<p className="googlesitekit-module-settings-group__helper-text">
						{ description }
					</p>
				</div>

				{ ! isEnabled && action && (
					<div className="googlesitekit-settings-measurement-row__action">
						{ action }
					</div>
				) }
			</div>
		</div>
	);
};

export default MeasurementSettingRow;
