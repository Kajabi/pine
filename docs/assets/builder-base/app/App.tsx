import React from 'react';
import {
  Box,
  Text,
  Button,
  Input,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Icon,
  Checkbox,
  Radio,
  Switch,
  Select,
  Textarea,
  Combobox,
  Chip,
  Avatar,
  Divider,
  Progress,
  Loader,
  Accordion,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Tooltip,
  Popover,
  Toast,
  Link,
  Image,
  Copytext,
  Tabs,
  DropdownMenu
} from './components';

function App() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('tab1');
  const [checkboxChecked, setCheckboxChecked] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('');
  const [switchChecked, setSwitchChecked] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [textareaValue, setTextareaValue] = React.useState('');
  const [selectValue, setSelectValue] = React.useState('');
  const [comboboxValue, setComboboxValue] = React.useState('');
  const [showSuccessToast, setShowSuccessToast] = React.useState(false);
  const [showWarningToast, setShowWarningToast] = React.useState(false);

  return (
    <Box direction="column" gap="lg" padding="lg" className="min-h-screen bg-gray-50 w-full">
      <Box direction="column" gap="md" className="w-full">
        {/* Header */}
        <Box direction="column" gap="sm" marginBottom="xl">
          <Text tag="h1" size="h1" weight="bold">
            Pine Design System - Complete Component Showcase
          </Text>
          <Text size="lg" color="#666">
            All available Pine DS components with working examples
          </Text>
        </Box>

        {/* Accordion */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Accordion</Text>
          <Accordion
            label="Click to expand this accordion"
            componentId="accordion-example"
          >
            <Box direction="column" padding="md">
              <Text>This is the accordion content that can be expanded or collapsed. It's useful for organizing content in a space-efficient way.</Text>
            </Box>
          </Accordion>
        </Box>

        {/* Alert */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Alert</Text>
          <Box direction="column" gap="md">
            <Alert variant="default" componentId="alert-default">
              This is a default alert message.
            </Alert>
            <Alert variant="success" componentId="alert-success">
              This is a success alert message.
            </Alert>
            <Alert variant="warning" componentId="alert-warning">
              This is a warning alert message.
            </Alert>
            <Alert variant="danger" componentId="alert-danger">
              This is a danger alert message.
            </Alert>
            <Alert variant="info" componentId="alert-info">
              This is an info alert message.
            </Alert>
            <Alert
              variant="success"
              heading="Alert with heading"
              dismissible
              componentId="alert-dismissible"
            >
              This alert has a heading and can be dismissed.
            </Alert>
          </Box>
        </Box>

        {/* Avatar */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Avatar</Text>
          <Box direction="row" gap="md" alignItems="center">
            <Avatar size="xs" componentId="avatar-xs" />
            <Avatar size="sm" componentId="avatar-sm" />
            <Avatar size="md" componentId="avatar-md" />
            <Avatar size="lg" componentId="avatar-lg" />
            <Avatar size="xl" componentId="avatar-xl" />
            <Avatar size="lg" badge componentId="avatar-badge" />
            <Avatar size="lg" dropdown componentId="avatar-dropdown" />
          </Box>
        </Box>

        {/* Button */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Button</Text>
          <Box direction="column" gap="md">
            <Box direction="row" gap="md" wrap="wrap">
              <Button variant="primary" componentId="btn-primary">Primary</Button>
              <Button variant="secondary" componentId="btn-secondary">Secondary</Button>
              <Button variant="accent" componentId="btn-accent">Accent</Button>
              <Button variant="destructive" componentId="btn-destructive">Destructive</Button>
            </Box>
            <Box direction="row" gap="md" wrap="wrap">
              <Button variant="disclosure" componentId="btn-disclosure">Disclosure</Button>
              <Button variant="unstyled" componentId="btn-unstyled">Unstyled</Button>
              <Button variant="primary" disabled componentId="btn-disabled">Disabled</Button>
              <Button variant="primary" loading componentId="btn-loading">Loading</Button>
            </Box>
            <Button variant="primary" fullWidth componentId="btn-full-width">Full Width</Button>
            <Button
              variant="primary"
              componentId="btn-with-icons"
              startIcon={<Icon name="add" size="16px" />}
              endIcon={<Icon name="arrowRight" size="16px" />}
            >
              With Icons
            </Button>
          </Box>
        </Box>

        {/* Checkbox */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Checkbox</Text>
          <Box direction="column" gap="md">
            <Checkbox
              label="Basic checkbox"
              componentId="checkbox-basic"
              checked={checkboxChecked}
              onChange={(detail) => setCheckboxChecked(detail.checked)}
            />
            <Checkbox
              label="Disabled checkbox"
              disabled
              componentId="checkbox-disabled"
            />
            <Checkbox
              label="Invalid checkbox"
              invalid
              errorMessage="This field is required"
              componentId="checkbox-invalid"
            />
            <Checkbox
              label="Checkbox with helper text"
              helperMessage="This is helper text"
              componentId="checkbox-helper"
            />
            <Checkbox
              label="Indeterminate checkbox"
              indeterminate
              componentId="checkbox-indeterminate"
            />
          </Box>
        </Box>

        {/* Chip */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Chip</Text>
          <Box direction="column" gap="md">
            <Box direction="row" gap="md" wrap="wrap">
              <Chip sentiment="neutral" componentId="chip-neutral">Neutral</Chip>
              <Chip sentiment="accent" componentId="chip-accent">Accent</Chip>
              <Chip sentiment="brand" componentId="chip-brand">Brand</Chip>
              <Chip sentiment="danger" componentId="chip-danger">Danger</Chip>
            </Box>
            <Box direction="row" gap="md" wrap="wrap">
              <Chip sentiment="info" componentId="chip-info">Info</Chip>
              <Chip sentiment="success" componentId="chip-success">Success</Chip>
              <Chip sentiment="warning" componentId="chip-warning">Warning</Chip>
            </Box>
            <Box direction="row" gap="md" wrap="wrap">
              <Chip sentiment="neutral" variant="tag" componentId="chip-tag">Tag Variant</Chip>
              <Chip sentiment="neutral" dot componentId="chip-dot">With Dot</Chip>
              <Chip sentiment="neutral" large componentId="chip-large">Large</Chip>
            </Box>
          </Box>
        </Box>

        {/* Combobox */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Combobox</Text>
          <Box direction="column" gap="md">
            <Combobox
              label="Basic combobox"
              placeholder="Search options"
              componentId="combobox-basic"
              value={comboboxValue}
              onChange={(value) => setComboboxValue(value as string)}
              options={[
                { label: 'Apple', value: 'apple' },
                { label: 'Banana', value: 'banana' },
                { label: 'Cherry', value: 'cherry' },
                { label: 'Date', value: 'date' },
                { label: 'Elderberry', value: 'elderberry' }
              ]}
            />
            <Combobox
              label="Multi-select combobox"
              placeholder="Select multiple"
              componentId="combobox-multi"
              multiSelect
              options={[
                { label: 'Red', value: 'red' },
                { label: 'Green', value: 'green' },
                { label: 'Blue', value: 'blue' },
                { label: 'Yellow', value: 'yellow' }
              ]}
            />
            <Combobox
              label="Disabled combobox"
              placeholder="Cannot select"
              disabled
              componentId="combobox-disabled"
              options={[
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' }
              ]}
            />
          </Box>
        </Box>

        {/* Copytext */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Copytext</Text>
          <Box direction="column" gap="md">
            <Copytext value="Copy this text" componentId="copytext-basic">
              Click the copy icon to copy this text
            </Copytext>
            <Copytext value="https://example.com/api/key/12345" componentId="copytext-url">
              API Key: https://example.com/api/key/12345
            </Copytext>
          </Box>
        </Box>

        {/* Divider */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Divider</Text>
          <Box direction="column" gap="md">
            <Text>Content above divider</Text>
            <Divider direction="horizontal" componentId="divider-horizontal" />
            <Text>Content below divider</Text>
          </Box>
        </Box>

        {/* DropdownMenu */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">DropdownMenu</Text>
          <DropdownMenu
            trigger={
              <Button variant="secondary" componentId="dropdown-trigger">
                Open Menu
              </Button>
            }
            items={[
              { label: 'Edit', value: 'edit' },
              { label: 'Duplicate', value: 'duplicate' },
              { label: 'Archive', value: 'archive', separator: true },
              { label: 'Delete', value: 'delete' }
            ]}
            componentId="dropdown-menu-basic"
          />
        </Box>

        {/* Icon */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Icon</Text>
          <Box direction="row" gap="md" wrap="wrap" alignItems="center">
            <Icon name="user" size="24px" />
            <Icon name="gear" size="24px" />
            <Icon name="mail" size="24px" />
            <Icon name="download" size="24px" />
            <Icon name="home" size="24px" />
            <Icon name="search" size="24px" />
            <Icon name="bell" size="24px" />
            <Icon name="star" size="24px" />
            <Icon name="add" size="24px" />
            <Icon name="trash" size="24px" />
            <Icon name="pen" size="24px" />
            <Icon name="copy" size="24px" />
            <Icon name="caretUp" size="24px" />
            <Icon name="caretDown" size="24px" />
            <Icon name="caretLeft" size="24px" />
            <Icon name="caretRight" size="24px" />
          </Box>
        </Box>

        {/* Image */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Image</Text>
          <Box direction="row" gap="md">
            <Image
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
              alt="Sample image"
              width="300"
              height="200"
              componentId="image-basic"
            />
            <Image
              src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
              alt="Small image"
              width="150"
              height="150"
              componentId="image-small"
            />
          </Box>
        </Box>

        {/* Input */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Input</Text>
          <Box direction="column" gap="md">
            <Input
              label="Text Input"
              placeholder="Enter text"
              componentId="input-text"
              value={inputValue}
              onChange={(detail) => setInputValue(detail.value || '')}
            />
            <Input
              label="Email Input"
              type="email"
              placeholder="Enter email"
              componentId="input-email"
            />
            <Input
              label="Password Input"
              type="password"
              placeholder="Enter password"
              componentId="input-password"
            />
            <Input
              label="Number Input"
              type="number"
              placeholder="Enter number"
              componentId="input-number"
            />
            <Input
              label="Disabled Input"
              placeholder="Cannot edit"
              disabled
              componentId="input-disabled"
            />
            <Input
              label="Invalid Input"
              placeholder="Enter valid data"
              invalid
              errorMessage="This field is required"
              componentId="input-invalid"
            />
            <Input
              label="Input with helper text"
              placeholder="Enter data"
              helperMessage="This is helper text"
              componentId="input-helper"
            />
          </Box>
        </Box>

        {/* Link */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Link</Text>
          <Box direction="column" gap="md">
            <Link href="#" variant="inline" componentId="link-inline">
              This is an inline link
            </Link>
            <Link href="#" variant="plain" componentId="link-plain">
              This is a plain link
            </Link>
            <Link href="#" external componentId="link-external">
              This is an external link
            </Link>
            <Link href="#" fontSize="sm" componentId="link-small">
              Small link
            </Link>
            <Link href="#" fontSize="lg" componentId="link-large">
              Large link
            </Link>
          </Box>
        </Box>

        {/* Loader */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Loader</Text>
          <Box direction="row" gap="md" alignItems="center">
            <Loader variant="spinner" componentId="loader-spinner" />
            <Loader variant="ellipsis" componentId="loader-ellipsis" />
            <Loader variant="spinner" size="32px" componentId="loader-large" />
          </Box>
        </Box>

        {/* Modal */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Modal</Text>
          <Button
            variant="primary"
            componentId="modal-trigger"
            onClick={() => setModalOpen(true)}
          >
            Open Modal
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            componentId="modal-basic"
            size="md"
          >
            <ModalHeader>
              <Box direction="column" fit padding="md" borderRadius="lg">
                <Box alignItems="center" fit justifyContent="space-between">
                  <Text tag="h3" size="lg" weight="semibold">Simple Modal</Text>
                  <Button
                    class="pds-modal__close"
                    variant="unstyled"
                    iconOnly
                    onClick={() => setModalOpen(false)}
                    aria-label="Close modal"
                  >
                    <Icon slot="start" name="remove" aria-hidden="true"></Icon>
                  </Button>
                </Box>
              </Box>
            </ModalHeader>
            <ModalContent>
              <Box fit direction="column" paddingInlineStart="md" paddingInlineEnd="md">
                <Text>
                  This is a simple modal with basic content. The modal uses proper sub-components for header, content, and footer sections.
                </Text>
              </Box>
            </ModalContent>
            <ModalFooter>
              <Box fit justifyContent="end" padding="md" gap="sm" borderRadius="lg">
                <Button
                  variant="secondary"
                  componentId="modal-cancel"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  componentId="modal-confirm"
                  onClick={() => setModalOpen(false)}
                >
                  Confirm
                </Button>
              </Box>
            </ModalFooter>
          </Modal>
        </Box>

        {/* Popover */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Popover</Text>
         <Popover componentId="auto" text="Auto Popover">
            <p>Clicks outside will close this popover</p>
          </Popover>
        </Box>

        {/* Progress */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Progress</Text>
          <Box direction="column" gap="md">
            <Progress
              label="Progress 25%"
              percent={25}
              showPercent
              componentId="progress-25"
            />
            <Progress
              label="Progress 50%"
              percent={50}
              showPercent
              componentId="progress-50"
            />
            <Progress
              label="Progress 75%"
              percent={75}
              showPercent
              componentId="progress-75"
            />
            <Progress
              label="Animated Progress"
              percent={60}
              animated
              showPercent
              componentId="progress-animated"
            />
            <Progress
              label="Green Progress"
              percent={40}
              fillColor="#22c55e"
              componentId="progress-green"
            />
            <Progress
              label="Orange Progress"
              percent={65}
              fillColor="#f97316"
              componentId="progress-orange"
            />
            <Progress
              label="Purple Progress"
              percent={80}
              fillColor="#a855f7"
              componentId="progress-purple"
            />
            <Progress
              label="Red Progress"
              percent={30}
              fillColor="#ef4444"
              componentId="progress-red"
            />
          </Box>
        </Box>

        {/* Radio */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Radio</Text>
          <Box direction="column" gap="md">
            <Radio
              label="Option 1"
              name="radio-group"
              value="option1"
              componentId="radio-1"
              checked={radioValue === 'option1'}
              onChange={() => setRadioValue('option1')}
            />
            <Radio
              label="Option 2"
              name="radio-group"
              value="option2"
              componentId="radio-2"
              checked={radioValue === 'option2'}
              onChange={() => setRadioValue('option2')}
            />
            <Radio
              label="Option 3"
              name="radio-group"
              value="option3"
              componentId="radio-3"
              checked={radioValue === 'option3'}
              onChange={() => setRadioValue('option3')}
            />
            <Radio
              label="Disabled option"
              name="radio-group"
              value="disabled"
              disabled
              componentId="radio-disabled"
            />
          </Box>
        </Box>

        {/* Select */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Select</Text>
          <Box direction="column" gap="md">
            <Select
              label="Basic Select"
              name="select-basic"
              componentId="select-basic"
              value={selectValue}
              onChange={(event) => setSelectValue((event.target as HTMLSelectElement).value)}
            >
              <option value="">Choose an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
            <Select
              label="Disabled Select"
              name="select-disabled"
              componentId="select-disabled"
              disabled
            >
              <option value="">Cannot select</option>
              <option value="option1">Option 1</option>
            </Select>
            <Select
              label="Invalid Select"
              name="select-invalid"
              componentId="select-invalid"
              invalid
              errorMessage="Please select an option"
            >
              <option value="">Choose an option</option>
              <option value="option1">Option 1</option>
            </Select>
          </Box>
        </Box>

        {/* Switch */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Switch</Text>
          <Box direction="column" gap="md">
            <Switch
              label="Basic switch"
              componentId="switch-basic"
              checked={switchChecked}
              onChange={() => setSwitchChecked(!switchChecked)}
            />
            <Switch
              label="Disabled switch"
              disabled
              componentId="switch-disabled"
            />
            <Switch
              label="Switch with helper text"
              helperMessage="This is helper text"
              componentId="switch-helper"
            />
            <Switch
              label="Invalid switch"
              invalid
              errorMessage="This field is required"
              componentId="switch-invalid"
            />
          </Box>
        </Box>

        {/* Table */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Table</Text>
          <Table componentId="basic-table" responsive className="w-full">
            <TableHead>
              <TableRow>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Role</TableHeadCell>
                <TableHeadCell>Department</TableHeadCell>
                <TableHeadCell>Join Date</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Engineering</TableCell>
                <TableCell>2023-01-15</TableCell>
                <TableCell>
                  <Chip sentiment="success" componentId="status-active-1">Active</Chip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>jane@example.com</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Marketing</TableCell>
                <TableCell>2023-03-22</TableCell>
                <TableCell>
                  <Chip sentiment="warning" componentId="status-pending-1">Pending</Chip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bob Johnson</TableCell>
                <TableCell>bob@example.com</TableCell>
                <TableCell>Editor</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>2023-02-10</TableCell>
                <TableCell>
                  <Chip sentiment="success" componentId="status-active-2">Active</Chip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sarah Wilson</TableCell>
                <TableCell>sarah@example.com</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Sales</TableCell>
                <TableCell>2022-11-08</TableCell>
                <TableCell>
                  <Chip sentiment="success" componentId="status-active-3">Active</Chip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mike Davis</TableCell>
                <TableCell>mike@example.com</TableCell>
                <TableCell>Developer</TableCell>
                <TableCell>Engineering</TableCell>
                <TableCell>2023-04-05</TableCell>
                <TableCell>
                  <Chip sentiment="danger" componentId="status-inactive-1">Inactive</Chip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lisa Chen</TableCell>
                <TableCell>lisa@example.com</TableCell>
                <TableCell>Designer</TableCell>
                <TableCell>Design</TableCell>
                <TableCell>2023-01-30</TableCell>
                <TableCell>
                  <Chip sentiment="success" componentId="status-active-4">Active</Chip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Tabs */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Tabs</Text>
          <Tabs
            tablistLabel="Example tabs"
            variant="primary"
            activeTabName={activeTab}
            componentId="tabs-basic"
            onTabClick={([index, name]) => setActiveTab(name)}
          >
            <pds-tab name="tab1">Tab 1</pds-tab>
            <pds-tab name="tab2">Tab 2</pds-tab>
            <pds-tab name="tab3">Tab 3</pds-tab>
            <pds-tab-panel name="tab1">
              <Box direction="column" padding="md">
                <Text>Content for Tab 1. This is the first tab panel.</Text>
              </Box>
            </pds-tab-panel>
            <pds-tab-panel name="tab2">
              <Box direction="column" padding="md">
                <Text>Content for Tab 2. This is the second tab panel.</Text>
              </Box>
            </pds-tab-panel>
            <pds-tab-panel name="tab3">
              <Box direction="column" padding="md">
                <Text>Content for Tab 3. This is the third tab panel.</Text>
              </Box>
            </pds-tab-panel>
          </Tabs>
        </Box>

        {/* Text */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Text</Text>
          <Box direction="column" gap="md">
            <Text tag="h1" size="h1" weight="bold">Heading 1</Text>
            <Text tag="h2" size="h2" weight="bold">Heading 2</Text>
            <Text tag="h3" size="h3" weight="semibold">Heading 3</Text>
            <Text tag="h4" size="h4" weight="semibold">Heading 4</Text>
            <Text tag="h5" size="h5" weight="medium">Heading 5</Text>
            <Text tag="h6" size="h6" weight="medium">Heading 6</Text>
            <Text size="2xl">Extra large text</Text>
            <Text size="xl">Large text</Text>
            <Text size="lg">Large text</Text>
            <Text size="md">Medium text (default)</Text>
            <Text size="sm">Small text</Text>
            <Text size="xs">Extra small text</Text>
            <Text weight="bold">Bold text</Text>
            <Text weight="semibold">Semibold text</Text>
            <Text weight="medium">Medium weight text</Text>
            <Text weight="regular">Regular text</Text>
            <Text weight="light">Light text</Text>
            <Text italic>Italic text</Text>
            <Text decoration="underline-dotted">Underlined text</Text>
            <Text decoration="strikethrough">Strikethrough text</Text>
            <Text align="center">Centered text</Text>
            <Text align="end">Right aligned text</Text>
            <Text color="#0066cc">Blue text</Text>
            <Text truncate className="max-w-xs">This is a very long text that will be truncated when it exceeds the container width</Text>
          </Box>
        </Box>

        {/* Textarea */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Textarea</Text>
          <Box direction="column" gap="md">
            <Textarea
              label="Basic Textarea"
              placeholder="Enter long text"
              componentId="textarea-basic"
              rows={3}
              value={textareaValue}
              onChange={(detail) => setTextareaValue(detail.value || '')}
            />
            <Textarea
              label="Disabled Textarea"
              placeholder="Cannot edit"
              disabled
              componentId="textarea-disabled"
              rows={3}
            />
            <Textarea
              label="Invalid Textarea"
              placeholder="Enter valid data"
              invalid
              errorMessage="This field is required"
              componentId="textarea-invalid"
              rows={3}
            />
            <Textarea
              label="Textarea with helper text"
              placeholder="Enter description"
              helperMessage="Maximum 500 characters"
              componentId="textarea-helper"
              rows={4}
            />
          </Box>
        </Box>

        {/* Toast */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Toast</Text>
          <Box direction="row" gap="md">
            <Button
              variant="primary"
              componentId="toast-success-trigger"
              onClick={() => {
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 5000);
              }}
            >
              Show Success Toast
            </Button>
            <Button
              variant="secondary"
              componentId="toast-warning-trigger"
              onClick={() => {
                setShowWarningToast(true);
                setTimeout(() => setShowWarningToast(false), 5000);
              }}
            >
              Show Warning Toast
            </Button>
          </Box>
          {showSuccessToast && (
            <Toast
             type="default"
              componentId="toast-success"
             onDismissed={() => setShowSuccessToast(false)}
            >
              Success! Your action was completed successfully.
            </Toast>
          )}
          {showWarningToast && (
            <Toast
             type="danger"
              componentId="toast-warning"
             onDismissed={() => setShowWarningToast(false)}
            >
              Error! Something went wrong. Please try again.
            </Toast>
          )}
        </Box>

        {/* Tooltip */}
        <Box direction="column" padding="lg" border borderRadius="md" backgroundColor="white">
          <Text tag="h2" size="h3" weight="semibold" gutter="md">Tooltip</Text>

            <Tooltip content="This is a simple tooltip" placement="top" componentId="tooltip-1">
              <Button variant="primary" componentId="tooltip-btn-1">Hover me</Button>
            </Tooltip>

        </Box>
      </Box>
    </Box>
  );
}

export default App;