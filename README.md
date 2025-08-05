# CRM Dashboard

A modern CRM dashboard application with authentication, user management, and module-based functionality.

## 🚀 Features

### Authentication & User Management
- **User Registration**: Create new accounts with username, email, and password
- **User Login**: Secure authentication system
- **User Profiles**: View user information and status
- **User Status**: Real-time online/away/offline status indicators
- **Session Management**: Persistent login sessions

### CRM Functionality
- **Module-based Interface**: Organized sections for different CRM functions
- **Search Functionality**: Find modules and sections quickly
- **Responsive Design**: Works on desktop and mobile devices
- **Data Persistence**: All data stored locally using localStorage

### User Interface
- **Classic CRM Design**: Clean, professional interface
- **Responsive Layout**: Adapts to different screen sizes
- **Professional Theme**: Business-focused color scheme
- **Smooth Interactions**: Enhanced user experience

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.7
- **Icons**: Bootstrap Icons
- **Storage**: LocalStorage for data persistence
- **Styling**: Custom CSS with professional design

## 📁 Project Structure

```
CRM-DASHBOARD-main/
├── App/
│   ├── Index.html          # Main application file
│   ├── style.css           # Custom styles and layout
│   ├── script.js           # Application logic and functionality
│   └── crm_modules.json    # CRM modules configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation & Usage

1. **Download/Clone** the project to your local machine
2. **Open** `App/Index.html` in your web browser
3. **Sign Up** with a new account or use existing test accounts:
   - Username: `john_doe`, Password: `password123`
   - Username: `jane_smith`, Password: `password123`
   - Username: `mike_wilson`, Password: `password123`
   - Username: `sarah_jones`, Password: `password123`

## 🎯 How to Use

### Authentication
1. **First Time**: The app will show a login modal
2. **Sign Up**: Click "Sign up" to create a new account
3. **Login**: Use your credentials to log in
4. **Logout**: Click your username in the top-right corner and select "Logout"

### CRM Dashboard
1. **Navigate Modules**: Click on different modules in the sidebar
2. **Search**: Use the search bar to find specific modules or sections
3. **View Details**: Click on module sections to see detailed information
4. **User Management**: Access your profile and logout options

### Module Management
- **Customers**: Manage customer information and relationships
- **Sales**: Track leads, opportunities, and deals
- **Marketing**: Handle campaigns and analytics
- **Support**: Manage tickets and knowledge base

## 💾 Data Storage

The application uses **localStorage** to persist data:
- **Users**: All registered users and their information
- **Current User**: Active session information
- **CRM Data**: Module configurations and settings

## 🎨 Customization

### Colors
The application uses a professional color scheme:
```css
/* Primary colors */
--primary-color: #0d6efd;    /* Bootstrap primary */
--secondary-color: #6c757d;   /* Bootstrap secondary */
--success-color: #198754;     /* Success/online status */
--warning-color: #ffc107;     /* Warning/away status */
--danger-color: #dc3545;      /* Error/offline status */
```

### Features
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation support
- **Performance**: Optimized for smooth user experience
- **Security**: Client-side validation and data sanitization

## 🔧 Browser Compatibility

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 🚀 Future Enhancements

Potential features for future versions:
- **Real-time Data Sync** with backend
- **Advanced Analytics** and reporting
- **Customer Management** tools
- **Sales Pipeline** tracking
- **Marketing Automation** features
- **Support Ticket** system
- **User Permissions** and roles
- **Data Export** functionality
- **API Integration** capabilities
- **Mobile App** version

## 🐛 Troubleshooting

### Common Issues

1. **Login Not Working**
   - Clear browser localStorage and try again
   - Use one of the test accounts provided

2. **Modules Not Loading**
   - Check if crm_modules.json file is present
   - Ensure all files are in the correct directory

3. **Styling Issues**
   - Ensure all CSS files are loaded
   - Check browser console for errors

4. **Search Not Working**
   - Make sure you're typing in the search bar
   - Check for typos in module names

### Data Reset
To reset all data and start fresh:
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage for the domain
4. Refresh the page

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## 📞 Support

For support or questions:
- Check the troubleshooting section above
- Review the code comments for implementation details
- Test with the provided sample accounts

---

**Enjoy using your CRM Dashboard! 🎉** 