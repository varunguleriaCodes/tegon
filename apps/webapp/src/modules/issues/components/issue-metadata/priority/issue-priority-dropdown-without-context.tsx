import { observer } from 'mobx-react-lite';

import { IssuePriorityDropdownContent } from 'modules/issues/components';

import { Priorities } from 'common/types';

interface IssuePriorityDropdownWithoutContextProps {
  onChange?: (priority: number | number[]) => void;
  onClose: () => void;
  value: number | number[];
}

export const IssuePriorityDropdownWithoutContext = observer(
  ({ onChange, onClose, value }: IssuePriorityDropdownWithoutContextProps) => {
    return (
      <IssuePriorityDropdownContent
        onChange={onChange}
        onClose={onClose}
        value={value}
        Priorities={Priorities}
      />
    );
  },
);
