using click2approve.WebAPI.Models;

namespace click2approve.WebAPI.Services;

/// <summary>
/// Implements a service that manages email.
/// </summary>
public class EmailServiceStub() : IEmailService
{
    /// <summary>
    /// Mocks the method for integration testing.
    /// </summary>
    public Task SendAsync(EmailMessage emailMessage, CancellationToken cancellationToken)
    {
        return Task.FromResult(0);
    }
}
